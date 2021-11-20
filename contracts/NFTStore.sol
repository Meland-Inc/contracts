// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "./NFTStoreStorage.sol";

// 官方商城合约
// 与marketplace的区别是. marketplace是用户和用户之间交易的合约.
// 交易的NFT是已经mint的.
// NFTStore 是官方和用户之间交易的合约.
// 交易的NFT是不存在的.准备mint的.

contract NFTStore is
    Initializable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable,
    NFTStoreStorage
{
    using SafeMathUpgradeable for uint256;
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private itemIdCounters;

    function initialize(
        // MELD 合约地址
        IERC20MELD _acceptedToken,
        address _officialWallet,
        address _foundationWallet,
        uint256 _ownerCutPerMillion
    ) public initializer {
        __UUPSUpgradeable_init();
        __AccessControl_init();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(UPGRADER_ROLE, msg.sender);
        _setupRole(GM_ROLE, msg.sender);

        acceptedToken = _acceptedToken;
        officialWallet = _officialWallet;
        foundationWallet = _foundationWallet;
        ownerCutPerMillion = _ownerCutPerMillion;
    }

    // 新增NFT售卖
    function createNFT(
        // nft address
        IERC721MelandNFT nft,
        // Purchase Price
        uint256 priceInWei,
        // Limit the number of individual wallet purchases
        // If 0 means no limit
        uint32 limit,
        // Whether to turn on restricted token id pool purchase
        // If restricted, the purchase is randomly given to the player from the id pool
        bool tokenIdPool,
        string memory description
    ) public {
        require(
            nft.hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Unauthorized user"
        );
        require(
            nft.hasRole(MINTER_ROLE, address(this)),
            "Must authorize contract minter privileges"
        );
        require(itemByNFT[nft].id == 0, "Already exists");

        uint256 itemId = itemIdCounters.current() + 1;
        itemIdCounters.increment();

        itemByNFT[nft] = Item(
            itemId, 
            msg.sender,
            tokenIdPool,
            priceInWei,
            0,
            limit,
            description
        );

        emit NFTCreated(itemId, msg.sender, nft, priceInWei);
    }

    function updateTokenIdPool(IERC721MelandNFT nft, uint256[] memory tokenIds)
        public
    {
        require(
            nft.hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Unauthorized user"
        );
        require(itemByNFT[nft].id > 0, "NFT not found");
        for (uint256 i = 0; i < tokenIds.length; i++) {
            try nft.ownerOf(tokenIds[i]) returns(address owner) {
                require(owner == address(0), "The token id pool exists for ids that have been minted");
            } catch(bytes memory) {
                // ok
            }
        }
        tokenIdsByNFT[nft] = tokenIds;
        emit NFTIdPoolUpdate(itemByNFT[nft].id, nft, tokenIds.length);
    }

    // 下架NFT
    function deleteNFT(IERC721MelandNFT nft) public {
        require(
            nft.hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Unauthorized user"
        );
        require(itemByNFT[nft].id > 0, "NFT not found");
        Item memory item = itemByNFT[nft];
        // 取消授权
        nft.renounceRole(MINTER_ROLE, address(this));
        delete itemByNFT[nft];

        emit NFTDelete(item.id, msg.sender, nft);
    }

    function randomIds(uint256[] memory ids) private view returns (uint256) {
        // sha3 and now have been deprecated
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, ids)
                )
            );
    }

    function getTokenIdByIdsPool(IERC721MelandNFT nft)
        private
        view
        returns (uint256, uint256)
    {
        require(tokenIdsByNFT[nft].length > 0, "nft Insufficient supply");
        uint256[] memory ids = tokenIdsByNFT[nft];
        uint256 tokenIdIndex = randomIds(ids) % ids.length;
        uint256 tokenId = ids[tokenIdIndex];
        return (tokenId, tokenIdIndex);
    }

    function popTokenIdPoolByTokenIdIndex(
        IERC721MelandNFT nft,
        uint256 tokenIdIndex
    ) private {
        uint256[] storage ids = tokenIdsByNFT[nft];

        // 更加节约gas feeds的方式删除array
        // 原理. 将需要删除的index用last覆盖
        // 随后用pop删除last
        // 这样做的好处是不会导致evm将array重新排序
        uint256 lastTokenIndex = ids.length - 1;
        uint256 lastTokenId = ids[lastTokenIndex];
        ids[tokenIdIndex] = lastTokenId;
        ids.pop();
        tokenIdsByNFT[nft] = ids;

        emit NFTIdPoolUpdate(itemByNFT[nft].id, nft, ids.length);
    }

    // 设置抽成
    // 50000 = 5%
    // 500000 = 50%
    function setOwnerCutPerMillion(uint256 _ownerCutPerMillion)
        public
        onlyRole(GM_ROLE)
    {
        require(
            _ownerCutPerMillion < 1000000,
            "The owner cut should be between 0 and 999,999"
        );

        ownerCutPerMillion = _ownerCutPerMillion;
        emit ChangedOwnerCutPerMillion(ownerCutPerMillion);
    }

    function buyNFT(IERC721MelandNFT nft, uint256 priceInWei) public {
        require(
            nft.totalSupply() < nft.getMintMax(),
            "Exceeding the maximum supply quantity"
        );
        Item memory item = itemByNFT[nft];
        require(item.id > 0, "NFT not found");
        require(item.priceInWei == priceInWei, "The price is not correct");

        // If the restriction is turned on
        if (item.limit > 0) {
            require(limitPool[nft][msg.sender] < item.limit, "Trigger restriction");
            limitPool[nft][msg.sender] = limitPool[nft][msg.sender].add(1);
        }

        address sender = _msgSender();
        address seller = item.seller;

        uint256 tokenId = 0;
        uint256 tokenIdIndex = 0;
        bool popTokenIdIndex = false;
        // token ids pools enable
        if (item.tokenIdPool) {
            (tokenId, tokenIdIndex) = getTokenIdByIdsPool(nft);
            popTokenIdIndex = true;
        } else {
            tokenId = nft.totalSupply() + 1;
        }

        item.sellsCount = item.sellsCount.add(1);
        itemByNFT[nft] = item;

        uint256 saleShareAmount = 0;

        if (ownerCutPerMillion > 0) {
            // Calculate sale share
            saleShareAmount = priceInWei.mul(ownerCutPerMillion).div(1000000);

            // 40% burn in handling fee
            uint256 burnAmount = saleShareAmount.mul(40).div(100);

            // The other 40% is held by the Foundation
            uint256 foundationAmount = saleShareAmount.mul(40).div(100);

            // The last 20% are official earnings
            uint256 officialAmount = saleShareAmount.mul(20).div(100);

            acceptedToken.burnFrom(sender, burnAmount);
            require(
                acceptedToken.transferFrom(
                    sender,
                    foundationWallet,
                    foundationAmount
                ),
                "Handling fee transfer to foundationWallet failure"
            );
            require(
                acceptedToken.transferFrom(
                    sender,
                    officialWallet,
                    officialAmount
                ),
                "Handling fee transfer to officialWallet to off failure"
            );
        }

        // Transfer sale amount to seller
        require(
            acceptedToken.transferFrom(
                sender,
                seller,
                priceInWei.sub(saleShareAmount)
            ),
            "Transfering the sale amount to the seller failed"
        );

        nft.safeMint(sender, tokenId);

        if (popTokenIdIndex) {
            popTokenIdPoolByTokenIdIndex(nft, tokenIdIndex);
        }

        emit NFTBuyed(item.id, sender, nft, priceInWei);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}
}
