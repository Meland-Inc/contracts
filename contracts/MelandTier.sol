// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/utils/ERC1155HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./MelandTierStorage.sol";
import "./Meland1155CID.sol";
import "./MelandAccessRoles.sol";

contract MelandTier is
    Initializable,
    MelandAccessRoles,
    MelandTierStorage,
    Meland1155CID,
    ERC1155HolderUpgradeable,
    UUPSUpgradeable
{
    function initialize(string memory uri) public initializer {
        __UUPSUpgradeable_init();
        __ERC1155MelandCID_init(uri);
        __MelandAccessRoles_init();
    }

    function setURI(string memory newuri) public onlyRole(GM_ROLE) {
        _setURI(newuri);
    }

    // According to the cid mint in the game
    function mint(
        address account,
        uint256 cid,
        uint256 amount,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) {
        _mint(account, cid, amount, data);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {

    }

    function isApprovedForAll(address _owner, address _operator)
        public
        view
        override
        returns (bool isOperator)
    {
        // if OpenSea's ERC1155 Proxy Address is detected, auto-return true
        if (_operator == address(0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101)) {
            return true;
        }

        return super.isApprovedForAll(_owner, _operator);
    }

    function random(uint256[] memory arr) private view returns (uint256) {
        // sha3 and now have been deprecated
        return
            uint256(
                keccak256(abi.encodePacked(block.difficulty, block.timestamp, arr))
            );
    }

    function getAllRewardsById(uint256 id) public view returns(
        ERC1155Reward[] memory erc1155rewards,
        ERC721Reward[] memory erc721rewards,
        ERC20Reward[] memory erc20rewards
    ) {
        Reward memory reward = rewardById[id];
        for (uint8 i = 0; i < reward.erc1155RewardIds.length; i ++) {
            erc1155rewards[i] = erc1155RewardById[reward.erc1155RewardIds[i]];
        }
        for (uint8 i = 0; i < reward.erc721RewardIds.length; i ++) {
            erc721rewards[i] = erc721RewardById[reward.erc721RewardIds[i]];
        }
        for (uint8 i = 0; i < reward.erc20RewardIds.length; i ++) {
            erc20rewards[i] = erc20RewardById[reward.erc20RewardIds[i]];
        }
    }

    //
    function openTier(uint256 id) public returns(uint256[2] memory returnRewardIds)
    {
        require(balanceOf(_msgSender(), id) > 0, "Insufficient balance");

        uint256 cid = getCidByTokenId(id);

        // Start lottery, random
        uint256[] storage rewardIdsFor100Percent = currentNFTPoolFor100PercentByCId[cid];
        uint256[] storage rewardIdsForOption = currentNFTPoolForOptionByCId[cid];
        require(rewardIdsFor100Percent.length > 0, "system failed");

        uint256 indexFor100Percent = random(rewardIdsFor100Percent) % rewardIdsFor100Percent.length;
        uint256 rewardIdFor100Percent = rewardIdsFor100Percent[
            indexFor100Percent
        ];

        returnRewardIds[0] = rewardIdFor100Percent;
        _transferReward(_msgSender(), rewardIdFor100Percent);

        // Saving gas will be rewarded by removing
        uint256 lastIndex = rewardIdsFor100Percent.length - 1;
        uint256 lastRewardId = rewardIdsFor100Percent[lastIndex];
        rewardIdsFor100Percent[indexFor100Percent] = lastRewardId;
        rewardIdsFor100Percent.pop();
        currentNFTPoolFor100PercentByCId[cid] = rewardIdsFor100Percent;

        if (rewardIdsForOption.length > 0) {
            uint256 indexForOption = random(rewardIdsForOption) % rewardIdsForOption.length;
            uint256 rewardIdForOption = rewardIdsForOption[indexForOption];
            returnRewardIds[1] = rewardIdForOption;
            _transferReward(_msgSender(), rewardIdForOption);

            // Saving gas will be rewarded by removing
            uint256 lastOpIndex = rewardIdsForOption.length - 1;
            uint256 lastOpRewardId = rewardIdsForOption[lastOpIndex];
            rewardIdsForOption[indexForOption] = lastOpRewardId;
            rewardIdsForOption.pop();
            currentNFTPoolForOptionByCId[cid] = rewardIdsForOption;
        }

        burn(_msgSender(), id, 1);

        emit OpenTier(returnRewardIds);
    }

    function startSale(uint256 cid) public onlyRole(GM_ROLE) {
        _startSale(cid);
    }

    function _checkCanSale(uint256 id) internal view {
        uint256 cid = getCidByTokenId(id);
        require(
            saleNFTPoolFor100PercentByCId[cid].length > 0,
            "Sales don't seem to be ready(100Percent reward)"
        );
        require(
            saleNFTPoolFor100PercentByCId[cid].length >= totalSupply(id),
            "Insufficient reward items"
        );
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(Meland1155CID) {
        // If is mint
        // Check tier ready to
        // This is to prevent players from buying a tier and not being able to open it or get a reward unfairly
        if (from == address(0)) {
            for (uint256 i = 0; i < ids.length; i++) {
                _checkCanSale(ids[i]);
            }
        }

        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(
            ERC1155Upgradeable,
            AccessControlUpgradeable,
            ERC1155ReceiverUpgradeable
        )
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
