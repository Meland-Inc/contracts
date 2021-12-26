// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

// TODO.
// Support ERC1155.

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

    function setPublicationFee(uint256 _publicationFee)
        public
        onlyRole(GM_ROLE)
    {
        publicationFeeInWei = _publicationFee;
        emit ChangedPublicationFee(publicationFeeInWei);
    }

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
    function createOrderWith721(
        IERC721 nftAddress,
        uint256 assetId,
        uint256 priceInWei,
        uint256 expiresAt
    ) public whenNotPaused {
        _createOrderWith721(nftAddress, assetId, priceInWei, expiresAt);
    }

    // 创建订单
    function createOrderWith1155(
        IERC1155 nftAddress,
        uint256 assetId,
        uint256 priceInWei,
        uint256 expiresAt
    ) public whenNotPaused {
        _createOrderWith1155(nftAddress, assetId, priceInWei, expiresAt);
    }

    // 取消订单
    function cancelOrder(address nftAddress, uint256 assetId)
        public
        whenNotPaused
    {
        _cancelOrder(nftAddress, assetId);
    }

    // buy
    function safeExecuteOrder(
        address nftAddress,
        uint256 assetId,
        uint256 price
    ) public whenNotPaused {
        _executeOrder(nftAddress, assetId, price);
    }

    // buy
    function executeOrder(
        address nftAddress,
        uint256 assetId,
        uint256 price
    ) public whenNotPaused {
        _executeOrder(nftAddress, assetId, price);
    }

    function updateOrder(
        address nft,
        uint256 assetId,
        uint256 priceInWei,
        uint256 expiresAt
    ) public whenNotPaused {
        _updateOrder(nft, assetId, priceInWei, expiresAt);
    }

    function _updateOrder(
        address nftAddress,
        uint256 assetId,
        uint256 priceInWei,
        uint256 expiresAt
    ) internal {
        address sender = _msgSender();
        require(priceInWei > 0, "Price should be bigger than 0");
        require(
            expiresAt > block.timestamp.add(1 minutes),
            "Publication should be more than 1 minute in the future"
        );
        Order memory order = orderByAssetId[nftAddress][assetId];
        require(sender == order.seller, "Only the owner can create orders");
        order.price = priceInWei;
        order.expiresAt = expiresAt;
        orderByAssetId[nftAddress][assetId] = order;

        emit OrderUpdated(order.id, priceInWei, expiresAt);
    }

    function _createOrderWith721(
        IERC721 nft,
        uint256 assetId,
        uint256 priceInWei,
        uint256 expiresAt
    ) internal {
        address sender = _msgSender();

        IERC721 nftRegistry = nft;
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
                address(nft),
                priceInWei
            )
        );

        ERC721Or1155 memory erc721Or1155NFT;

        erc721Or1155NFT.erc721 = nft;

        orderByAssetId[address(nft)][assetId] = Order({
            id: orderId,
            seller: assetOwner,
            assetId: assetId,
            nft: erc721Or1155NFT,
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
            erc721Or1155NFT,
            priceInWei,
            expiresAt
        );
    }

    function _createOrderWith1155(
        IERC1155 nft,
        uint256 assetId,
        uint256 priceInWei,
        uint256 expiresAt
    ) internal {
        address sender = _msgSender();
        require(nft.balanceOf(sender, assetId) > 0, "Only the owner can create orders");
        require(
            nft.isApprovedForAll(sender, address(this)),
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
                sender,
                assetId,
                address(nft),
                priceInWei
            )
        );

        ERC721Or1155 memory erc721Or1155NFT;

        erc721Or1155NFT.erc1155 = nft;

        orderByAssetId[address(nft)][assetId] = Order({
            id: orderId,
            seller: sender,
            assetId: assetId,
            nft: erc721Or1155NFT,
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
            sender,
            erc721Or1155NFT,
            priceInWei,
            expiresAt
        );
    }

    function _cancelOrder(address nftAddress, uint256 assetId)
        internal
        returns (Order memory)
    {
        address sender = _msgSender();
        Order memory order = orderByAssetId[nftAddress][assetId];

        require(order.id != 0, "Asset not published");

        // GM or owner
        require(
            order.seller == sender || hasRole(GM_ROLE, sender),
            "Unauthorized user"
        );

        bytes32 orderId = order.id;
        address orderSeller = order.seller;
        delete orderByAssetId[nftAddress][assetId];

        emit OrderCancelled(orderId, assetId, orderSeller, order.nft);

        return order;
    }

    function _executeOrder(
        address nftAddress,
        uint256 assetId,
        uint256 price
    ) internal returns (Order memory) {
        address sender = _msgSender();

        Order memory order = orderByAssetId[nftAddress][assetId];
        require(order.id != 0, "Asset not published");
        address seller = order.seller;
        require(seller != address(0), "Invalid address");
        require(seller != sender, "Unauthorized user");
        require(order.price == price, "The price is not correct");
        require(block.timestamp < order.expiresAt, "The order expired");

        ERC721Or1155 memory erc721Or1155 = order.nft;

        {
            if (address(erc721Or1155.erc1155) != address(0)) {
                require(erc721Or1155.erc1155.balanceOf(seller, assetId) > 0, "The seller is no longer the owner");
            } else {
                require(
                    seller == erc721Or1155.erc721.ownerOf(assetId),
                    "The seller is no longer the owner"
                );
            }
        }

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
                price.sub(saleShareAmount)
            ),
            "Transfering the sale amount to the seller failed"
        );

        // Transfer asset owner
        {
            if (address(erc721Or1155.erc1155) != address(0)) {
                erc721Or1155.erc1155.safeTransferFrom(seller, sender, assetId, 1, '');
                require(erc721Or1155.erc1155.balanceOf(seller, assetId) > 0, "The seller is no longer the owner");
            } else {
                erc721Or1155.erc721.safeTransferFrom(seller, sender, assetId);
            }
        }

        emit OrderSuccessful(
            orderId,
            assetId,
            seller,
            erc721Or1155,
            price,
            sender
        );

        return order;
    }
}
