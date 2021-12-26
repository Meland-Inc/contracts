// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "./IMELD.sol";

contract MarketplaceStorage {
  // MELD Token.
  IERC20MELD public acceptedToken;

  // 40% ownerCutPerMillion
  address public foundationWallet;

  // 20% ownerCutPerMillion
  address public officialWallet;

  bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

  bytes32 public constant GM_ROLE = keccak256("GM_ROLE");

  struct ERC721Or1155 {
    IERC1155 erc1155;
    IERC721 erc721;
  }

  struct Order {
    // Order ID
    bytes32 id;

    address seller;

    // token id
    uint256 assetId;

    ERC721Or1155 nft;

    uint256 price;

    uint256 expiresAt;
  }

  // nft address -> (nft token id -> Order)
  mapping (address => mapping(uint256 => Order)) public orderByAssetId;

  // 
  uint256 public ownerCutPerMillion;

  // uploaded fee
  uint256 public publicationFeeInWei;

  // EVENTS
  event OrderCreated(
    bytes32 id,
    uint256 indexed assetId,
    address indexed seller,
    ERC721Or1155 nft,
    uint256 priceInWei,
    uint256 expiresAt
  );
  event OrderSuccessful(
    bytes32 id,
    uint256 indexed assetId,
    address indexed seller,
    ERC721Or1155 nft,
    uint256 totalPrice,
    address indexed buyer
  );
  event OrderCancelled(
    bytes32 id,
    uint256 indexed assetId,
    address indexed seller,
    ERC721Or1155 nft
  );
  event OrderUpdated(
    bytes32 id,
    uint256 priceInWei,
    uint256 expiresAt
  );

  event ChangedPublicationFee(uint256 publicationFee);
  
  event ChangedOwnerCutPerMillion(uint256 ownerCutPerMillion);
}