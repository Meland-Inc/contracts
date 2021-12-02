// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./IMELD.sol";

contract MarketplaceStorage {
  // MELD Token.
  IERC20MELD public acceptedToken;

  // 基金会钱包
  // 收取手续费中的40%
  address public foundationWallet;

  // 官方钱包
  // 收取手续费中的20%
  address public officialWallet;

  bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
  bytes32 public constant GM_ROLE = keccak256("GM_ROLE");

  struct Order {
    // Order ID
    bytes32 id;

    // 卖家
    address seller;

    // token id
    uint256 assetId;

    // NFT 合约地址
    IERC721 nftAddress;

    // 价格
    uint256 price;

    // 过期时间
    uint256 expiresAt;
  }

  // nft address -> (nft token id -> Order)
  mapping (IERC721 => mapping(uint256 => Order)) public orderByAssetId;

  // 抽成比例
  uint256 public ownerCutPerMillion;

  // 上架费用
  // 如果有则收取
  uint256 public publicationFeeInWei;

  // EVENTS
  event OrderCreated(
    bytes32 id,
    uint256 indexed assetId,
    address indexed seller,
    IERC721 nftAddress,
    uint256 priceInWei,
    uint256 expiresAt
  );
  event OrderSuccessful(
    bytes32 id,
    uint256 indexed assetId,
    address indexed seller,
    IERC721 nftAddress,
    uint256 totalPrice,
    address indexed buyer
  );
  event OrderCancelled(
    bytes32 id,
    uint256 indexed assetId,
    address indexed seller,
    IERC721 nftAddress
  );
  event OrderUpdated(
    bytes32 id,
    uint256 priceInWei,
    uint256 expiresAt
  );

  event ChangedPublicationFee(uint256 publicationFee);
  event ChangedOwnerCutPerMillion(uint256 ownerCutPerMillion);
}