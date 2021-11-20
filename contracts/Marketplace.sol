// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

/// 去中心化交易市场合约.

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "./MarketplaceStorage.sol";
import "./IMELD.sol";

contract Marketplace is
    Initializable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable,
    MarketplaceStorage
{
    using AddressUpgradeable for address;
    using SafeMathUpgradeable for uint256;

    function initialize(
        // MELD 合约地址
        IERC20MELD _acceptedToken,
        address _officialWallet,
        address _foundationWallet,
        // 抽成
        uint256 _ownerCutPerMillion
    ) public initializer {
        __UUPSUpgradeable_init();
        __AccessControl_init();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(UPGRADER_ROLE, msg.sender);
        _setupRole(GM_ROLE, msg.sender);

        // Fee init
        setOwnerCutPerMillion(_ownerCutPerMillion);
        setPublicationFee(0);
        acceptedToken = _acceptedToken;
        officialWallet = _officialWallet;
        foundationWallet = _foundationWallet;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    // 设置
    function setPublicationFee(uint256 _publicationFee) public onlyRole(GM_ROLE) {
        publicationFeeInWei = _publicationFee;
        emit ChangedPublicationFee(publicationFeeInWei);
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

    // 创建订单
    function createOrder(
        IERC721 nftAddress,
        uint256 assetId,
        uint256 priceInWei,
        uint256 expiresAt
    ) public whenNotPaused {
        _createOrder(nftAddress, assetId, priceInWei, expiresAt);
    }

    // 取消订单
    function cancelOrder(IERC721 nftAddress, uint256 assetId)
        public
        whenNotPaused
    {
        _cancelOrder(nftAddress, assetId);
    }

    // 购买
    function safeExecuteOrder(
        IERC721 nftAddress,
        uint256 assetId,
        uint256 price
    ) public whenNotPaused {
        _executeOrder(nftAddress, assetId, price);
    }

    // 购买订单
    function executeOrder(
        IERC721 nftAddress,
        uint256 assetId,
        uint256 price
    ) public whenNotPaused {
        _executeOrder(nftAddress, assetId, price);
    }

    // 创建订单
    function _createOrder(
        IERC721 nftAddress,
        uint256 assetId,
        uint256 priceInWei,
        uint256 expiresAt
    ) internal {
        address sender = _msgSender();

        IERC721 nftRegistry = nftAddress;
        address assetOwner = nftRegistry.ownerOf(assetId);

        require(sender == assetOwner, "Only the owner can create orders");
        require(
            nftRegistry.getApproved(assetId) == address(this) ||
                nftRegistry.isApprovedForAll(assetOwner, address(this)),
            "The contract is not authorized to manage the asset"
        );
        require(priceInWei > 0, "Price should be bigger than 0");
        require(
            expiresAt > block.timestamp.add(1 minutes),
            "Publication should be more than 1 minute in the future"
        );

        bytes32 orderId = keccak256(
            abi.encodePacked(
                block.timestamp,
                assetOwner,
                assetId,
                nftAddress,
                priceInWei
            )
        );

        orderByAssetId[nftAddress][assetId] = Order({
            id: orderId,
            seller: assetOwner,
            assetId: assetId,
            nftAddress: nftAddress,
            price: priceInWei,
            expiresAt: expiresAt
        });

        // Check if there's a publication fee and
        // transfer the amount to marketplace owner
        if (publicationFeeInWei > 0) {
            require(
                acceptedToken.transferFrom(
                    sender,
                    officialWallet,
                    publicationFeeInWei
                ),
                "Transfering the publication fee to the Marketplace owner failed"
            );
        }

        emit OrderCreated(
            orderId,
            assetId,
            assetOwner,
            nftAddress,
            priceInWei,
            expiresAt
        );
    }

    // 取消订单
    function _cancelOrder(IERC721 nftAddress, uint256 assetId)
        internal
        returns (Order memory)
    {
        address sender = _msgSender();
        Order memory order = orderByAssetId[nftAddress][assetId];

        require(order.id != 0, "Asset not published");

        // 只允许上架的人
        // 或者GM才能下架商品
        require(
            order.seller == sender || hasRole(GM_ROLE, sender),
            "Unauthorized user"
        );

        bytes32 orderId = order.id;
        address orderSeller = order.seller;
        IERC721 orderNftAddress = order.nftAddress;
        delete orderByAssetId[nftAddress][assetId];

        emit OrderCancelled(orderId, assetId, orderSeller, orderNftAddress);

        return order;
    }

    // 购买
    function _executeOrder(
        IERC721 nftAddress,
        uint256 assetId,
        uint256 price
    ) internal returns (Order memory) {
        address sender = _msgSender();

        IERC721 nftRegistry = nftAddress;

        Order memory order = orderByAssetId[nftAddress][assetId];

        require(order.id != 0, "Asset not published");

        address seller = order.seller;

        require(seller != address(0), "Invalid address");
        require(seller != sender, "Unauthorized user");
        require(order.price == price, "The price is not correct");
        require(block.timestamp < order.expiresAt, "The order expired");
        require(
            seller == nftRegistry.ownerOf(assetId),
            "The seller is no longer the owner"
        );

        uint256 saleShareAmount = 0;

        bytes32 orderId = order.id;
        delete orderByAssetId[nftAddress][assetId];

        if (ownerCutPerMillion > 0) {
            // Calculate sale share
            saleShareAmount = price.mul(ownerCutPerMillion).div(1000000);

            // 40% burn in handling fee 
            uint256 burnAmount = saleShareAmount.mul(40).div(100);

            // The other 40% is held by the Foundation
            uint256 foundationAmount = saleShareAmount.mul(40).div(100);

            // The last 20% are official earnings
            uint256 officialAmount = saleShareAmount.mul(20).div(100);

            acceptedToken.burnFrom(sender, burnAmount);
            require(
                acceptedToken.transferFrom(sender, foundationWallet, foundationAmount),
                "Handling fee transfer to foundationWallet failure"
            );
            require(
                acceptedToken.transferFrom(sender, officialWallet, officialAmount),
                "Handling fee transfer to officialWallet to off failure"
            );
        }

        // Transfer sale amount to seller
        require(
            acceptedToken.transferFrom(
                sender,
                seller,
                price.sub(saleShareAmount)
            ),
            "Transfering the sale amount to the seller failed"
        );

        // Transfer asset owner
        nftRegistry.safeTransferFrom(seller, sender, assetId);

        emit OrderSuccessful(
            orderId,
            assetId,
            seller,
            nftAddress,
            price,
            sender
        );

        return order;
    }
}
