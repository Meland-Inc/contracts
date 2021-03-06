// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

/// Meland.ai tier core data storage contract.

contract MelandTierStorage is ContextUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _rewardIdCounter;
    CountersUpgradeable.Counter private _erc1155RewardIdCounter;
    CountersUpgradeable.Counter private _erc721RewardIdCounter;
    CountersUpgradeable.Counter private _erc20RewardIdCounter;

    struct Reward {
        uint256[] erc1155RewardIds;
        uint256[] erc721RewardIds;
        uint256[] erc20RewardIds;
    }

    struct ERC1155Reward {
        IERC1155Upgradeable erc1155;
        uint256[] tokenIds;
        uint256[] amounts;
    }

    struct ERC721Reward {
        IERC721Upgradeable erc721;
        uint256 tokenId;
    }

    struct ERC20Reward {
        IERC20Upgradeable erc20;
        uint256 amount;
    }

    mapping(uint256 => ERC721Reward) public erc721RewardById;
    mapping(uint256 => ERC20Reward) public erc20RewardById;
    mapping(uint256 => ERC1155Reward) public erc1155RewardById;
    mapping(uint256 => Reward) internal rewardById;

    /// Current tier's remaining must-win prizes
    /// To prevent people from cheating, he is private
    mapping(uint256 => uint256[]) internal currentNFTPoolFor100PercentByCId;

    /// Must-win prizes at the opening of the sale
    /// For the sake of openness and transparency, he is public
    mapping(uint256 => uint256[]) internal saleNFTPoolFor100PercentByCId;

    /// Current tier's remaining probability of winning a prize
    /// To prevent people from cheating, he is private
    mapping(uint256 => uint256[]) internal currentNFTPoolForOptionByCId;

    /// Probability of winning a prize at the opening of the sale
    /// For the sake of openness and transparency, he is public
    mapping(uint256 => uint256[]) internal saleNFTPoolForOptionByCId;

    /// Whether the rewards have been transferred, to prevent excessive transfer bugs that lead to insufficient balance
    mapping(uint256 => bool) internal rewardTransferedByRewardId;

    // EVENTS
    event TierStartSale(uint256 indexed cid);

    event RewaardPoolUpdate(uint256 indexed cid);

    event CreateRewardERC1155(
        uint256 indexed rewardId,
        uint256 indexed erc1155RewardId,
        ERC1155Reward erc1155reward
    );
    event CreateRewardERC721(
        uint256 indexed rewardId,
        uint256 indexed erc721RewardId,
        ERC721Reward erc721reward
    );
    event CreateRewardERC20(
        uint256 indexed rewardId,
        uint256 indexed erc20RewardId,
        ERC20Reward erc20reward
    );

    event OpenTier(uint256[2] rewardIds);

    function _startSale(uint256 cid) internal {
        require(
            currentNFTPoolFor100PercentByCId[cid].length > 0,
            "Sales don't seem to be ready(100Percent reward)"
        );
        saleNFTPoolFor100PercentByCId[cid] = currentNFTPoolFor100PercentByCId[
            cid
        ];
        saleNFTPoolForOptionByCId[cid] = currentNFTPoolForOptionByCId[cid];

        emit TierStartSale(cid);
    }

    // Send the reward to the user, which usually happens when tier is open
    function _transferReward(address to, uint256 rewardId) internal {
        require(
            rewardTransferedByRewardId[rewardId] == false,
            "The award has already been transferred"
        );
        rewardTransferedByRewardId[rewardId] = true;

        Reward storage reward = rewardById[rewardId];

        // recive erc1155
        if (reward.erc1155RewardIds.length > 0) {
            for (uint256 i = 0; i < reward.erc1155RewardIds.length; i++) {
                uint256 erc1155RewardId = reward.erc1155RewardIds[i];
                ERC1155Reward memory erc1155reward = erc1155RewardById[
                    erc1155RewardId
                ];
                erc1155reward.erc1155.safeBatchTransferFrom(
                    address(this),
                    to,
                    erc1155reward.tokenIds,
                    erc1155reward.amounts,
                    ""
                );
            }
        }

        if (reward.erc721RewardIds.length > 0) {
            for (uint256 i = 0; i < reward.erc721RewardIds.length; i++) {
                uint256 erc721RewardId = reward.erc721RewardIds[i];
                ERC721Reward memory erc721reward = erc721RewardById[
                    erc721RewardId
                ];
                erc721reward.erc721.transferFrom(
                    address(this),
                    to,
                    erc721reward.tokenId
                );
            }
        }

        // if (reward.erc20RewardIds.length > 0) {
        //     for (uint256 i = 0; i < reward.erc20RewardIds.length; i++) {
        //         uint256 erc20RewardId = reward.erc20RewardIds[i];
        //         ERC20Reward memory erc20reward = erc20RewardById[erc20RewardId];
        //         erc20reward.erc20.transferFrom(
        //             address(this),
        //             to,
        //             erc20reward.amount
        //         );
        //     }
        // }
    }

    function _createReward(
        ERC1155Reward[] memory erc1155rewards,
        ERC721Reward[] memory erc721rewards,
        ERC20Reward[] memory erc20rewards
    ) internal returns (uint256 rewardId) {
        _rewardIdCounter.increment();
        rewardId = _rewardIdCounter.current();

        uint256[] memory erc1155RewardIds = new uint256[](
            erc1155rewards.length
        );
        uint256[] memory erc721RewardIds = new uint256[](erc721rewards.length);
        uint256[] memory erc20RewardIds = new uint256[](erc1155rewards.length);

        // uint8 is used here because you can't set too many things for each reward.
        for (uint8 i = 0; i < erc1155rewards.length; i++) {
            ERC1155Reward memory erc1155reward = erc1155rewards[i];
            _erc1155RewardIdCounter.increment();
            uint256 erc1155RewardId = _erc1155RewardIdCounter.current();
            erc1155RewardById[erc1155RewardId] = erc1155reward;
            erc1155RewardIds[i] = erc1155RewardId;
            erc1155reward.erc1155.safeBatchTransferFrom(
                _msgSender(),
                address(this),
                erc1155reward.tokenIds,
                erc1155reward.amounts,
                ""
            );

            emit CreateRewardERC1155(rewardId, erc1155RewardId, erc1155reward);
        }

        for (uint8 i = 0; i < erc721rewards.length; i++) {
            ERC721Reward memory erc721reward = erc721rewards[i];
            _erc721RewardIdCounter.increment();
            uint256 erc721RewardId = _erc721RewardIdCounter.current();
            erc721RewardById[erc721RewardId] = erc721reward;
            erc721RewardIds[i] = erc721RewardId;

            erc721reward.erc721.transferFrom(
                _msgSender(),
                address(this),
                erc721reward.tokenId
            );

            emit CreateRewardERC721(rewardId, erc721RewardId, erc721reward);
        }

        for (uint8 i = 0; i < erc20rewards.length; i++) {
            ERC20Reward memory erc20reward = erc20rewards[i];
            _erc20RewardIdCounter.increment();
            uint256 erc20RewardId = _erc20RewardIdCounter.current();
            erc20RewardById[erc20RewardId] = erc20reward;
            erc20RewardIds[i] = erc20RewardId;

            erc20reward.erc20.transferFrom(
                _msgSender(),
                address(this),
                erc20reward.amount
            );
            emit CreateRewardERC20(rewardId, erc20RewardId, erc20reward);
        }

        rewardById[rewardId] = Reward(
            erc1155RewardIds,
            erc721RewardIds,
            erc20RewardIds
        );
    }

    // Add bonus items in bulk to save gas fee
    // note: that the token associated with adding the reward must be approved in advance.
    function addOptionReward(
        uint256 cid,
        ERC1155Reward[] memory erc1155rewards,
        ERC721Reward[] memory erc721rewards,
        ERC20Reward[] memory erc20rewards
    ) public {
        require(
            saleNFTPoolFor100PercentByCId[cid].length == 0,
            "Sales have already started and cannot change the content of the reward pool"
        );
        currentNFTPoolForOptionByCId[cid].push(
            _createReward(erc1155rewards, erc721rewards, erc20rewards)
        );
        emit RewaardPoolUpdate(cid);
    }

    function fixed100PercentReward(
        uint256 cid,
        ERC1155Reward[] memory erc1155rewards,
        ERC721Reward[] memory erc721rewards,
        ERC20Reward[] memory erc20rewards
    ) public {
        saleNFTPoolFor100PercentByCId[cid].push(
            _createReward(erc1155rewards, erc721rewards, erc20rewards)
        );
        emit RewaardPoolUpdate(cid);
    }

    // Add bonus items in bulk to save gas fee
    // note: that the token associated with adding the reward must be approved in advance.
    function add100PercentReward(
        uint256 cid,
        ERC1155Reward[] memory erc1155rewards,
        ERC721Reward[] memory erc721rewards,
        ERC20Reward[] memory erc20rewards
    ) public {
        require(
            saleNFTPoolFor100PercentByCId[cid].length == 0,
            "Sales have already started and cannot change the content of the reward pool"
        );
        currentNFTPoolFor100PercentByCId[cid].push(
            _createReward(erc1155rewards, erc721rewards, erc20rewards)
        );
        emit RewaardPoolUpdate(cid);
    }
}
