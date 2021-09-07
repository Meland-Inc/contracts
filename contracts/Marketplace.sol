// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

/// 去中心化交易市场合约.

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "./MarketplaceStorage.sol";

contract Marketplace is Initializable, OwnableUpgradeable, PausableUpgradeable, UUPSUpgradeable, MarketplaceStorage {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    using AddressUpgradeable for address;
    using SafeMathUpgradeable for uint256;

    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    CountersUpgradeable.Counter private _tokenIdCounter;

    function initialize(
        // MELD 合约地址
        address _acceptedToken,

        // 抽成
        uint256 _ownerCutPerMillion
    ) initializer public {
        __Ownable_init();
        __UUPSUpgradeable_init();

        // Fee init
        setOwnerCutPerMillion(_ownerCutPerMillion);
        setPublicationFee(0);

        require(_acceptedToken.isContract(), "The accepted token address must be a deployed contract");
        acceptedToken = ERC20Interface(_acceptedToken);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {

    }

  // 设置
  function setPublicationFee(uint256 _publicationFee) public onlyOwner {
    publicationFeeInWei = _publicationFee;
    emit ChangedPublicationFee(publicationFeeInWei);
  }

  // 设置抽成
  function setOwnerCutPerMillion(uint256 _ownerCutPerMillion) public onlyOwner {
    require(_ownerCutPerMillion < 1000000, "The owner cut should be between 0 and 999,999");

    ownerCutPerMillion = _ownerCutPerMillion;
    emit ChangedOwnerCutPerMillion(ownerCutPerMillion);
  }

  // 创建订单
  function createOrder(
    address nftAddress,
    uint256 assetId,
    uint256 priceInWei,
    uint256 expiresAt
  )
    public
    whenNotPaused
  {
    _createOrder(
      nftAddress,
      assetId,
      priceInWei,
      expiresAt
    );
  }

  // 取消订单
  function cancelOrder(address nftAddress, uint256 assetId) public whenNotPaused {
    _cancelOrder(nftAddress, assetId);
  }

  // 购买
  function safeExecuteOrder(
    address nftAddress,
    uint256 assetId,
    uint256 price
  )
   public
   whenNotPaused
  {
    _executeOrder(
      nftAddress,
      assetId,
      price
    );
  }

  // 购买订单
  function executeOrder(
    address nftAddress,
    uint256 assetId,
    uint256 price
  )
   public
   whenNotPaused
  {
    _executeOrder(
      nftAddress,
      assetId,
      price
    );
  }

  // 创建订单
  function _createOrder(
    address nftAddress,
    uint256 assetId,
    uint256 priceInWei,
    uint256 expiresAt
  )
    internal
  {
    _requireERC721(nftAddress);

    address sender = _msgSender();

    ERC721Interface nftRegistry = ERC721Interface(nftAddress);
    address assetOwner = nftRegistry.ownerOf(assetId);

    require(sender == assetOwner, "Only the owner can create orders");
    require(
      nftRegistry.getApproved(assetId) == address(this) || nftRegistry.isApprovedForAll(assetOwner, address(this)),
      "The contract is not authorized to manage the asset"
    );
    require(priceInWei > 0, "Price should be bigger than 0");
    require(expiresAt > block.timestamp.add(1 minutes), "Publication should be more than 1 minute in the future");

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
      nftAddress: nftAddress,
      price: priceInWei,
      expiresAt: expiresAt
    });

    // Check if there's a publication fee and
    // transfer the amount to marketplace owner
    if (publicationFeeInWei > 0) {
      require(
        acceptedToken.transferFrom(sender, owner(), publicationFeeInWei),
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
  function _cancelOrder(address nftAddress, uint256 assetId) internal returns (Order memory) {
    address sender = _msgSender();
    Order memory order = orderByAssetId[nftAddress][assetId];

    require(order.id != 0, "Asset not published");
    require(order.seller == sender || sender == owner(), "Unauthorized user");

    bytes32 orderId = order.id;
    address orderSeller = order.seller;
    address orderNftAddress = order.nftAddress;
    delete orderByAssetId[nftAddress][assetId];

    emit OrderCancelled(
      orderId,
      assetId,
      orderSeller,
      orderNftAddress
    );

    return order;
  }


  // 购买
  function _executeOrder(
    address nftAddress,
    uint256 assetId,
    uint256 price
  )
   internal returns (Order memory)
  {
    _requireERC721(nftAddress);

    address sender = _msgSender();

    ERC721Verifiable nftRegistry = ERC721Verifiable(nftAddress);

    Order memory order = orderByAssetId[nftAddress][assetId];

    require(order.id != 0, "Asset not published");

    address seller = order.seller;

    require(seller != address(0), "Invalid address");
    require(seller != sender, "Unauthorized user");
    require(order.price == price, "The price is not correct");
    require(block.timestamp < order.expiresAt, "The order expired");
    require(seller == nftRegistry.ownerOf(assetId), "The seller is no longer the owner");

    uint saleShareAmount = 0;

    bytes32 orderId = order.id;
    delete orderByAssetId[nftAddress][assetId];

    if (ownerCutPerMillion > 0) {
      // Calculate sale share
      saleShareAmount = price.mul(ownerCutPerMillion).div(1000000);

      // Transfer share amount for marketplace Owner
      require(
        acceptedToken.transferFrom(sender, owner(), saleShareAmount),
        "Transfering the cut to the Marketplace owner failed"
      );
    }

    // Transfer sale amount to seller
    require(
      acceptedToken.transferFrom(sender, seller, price.sub(saleShareAmount)),
      "Transfering the sale amount to the seller failed"
    );

    // Transfer asset owner
    nftRegistry.safeTransferFrom(
      seller,
      sender,
      assetId
    );

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

  function _requireERC721(address nftAddress) internal view {
    require(nftAddress.isContract(), "The NFT Address should be a contract");

    ERC721Interface nftRegistry = ERC721Interface(nftAddress);
    require(
      nftRegistry.supportsInterface(ERC721_Interface),
      "The NFT contract has an invalid ERC721 implementation"
    );
  }
}