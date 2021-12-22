// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./IMELD.sol";
import "./IMelandStoreItems.sol";

contract NFTStoreStorage {
    // MELD Token.
    IERC20MELD public acceptedToken;

    address public foundationWallet;

    address public officialWallet;

    uint256 public ownerCutPerMillion;

    mapping(IMelandStoreItems => bool) public itemUploadedMap;

    mapping(bytes32 => uint256) private itemSymbolSales;

    // EVENTS
    event NFTCreated(
        IMelandStoreItems nftAddress
    );

    // EVENTS
    event NFTDelete(
        IMelandStoreItems nftAddress
    );

    event NFTBuyed(
        address indexed buyer,
        IMelandStoreItems indexed nftAddress,
        uint256 tokenId,
        uint256 priceInWei
    );

    // When 
    event NFTItemUpdate(IMelandStoreItems nftAddress, bool checked);

    event ChangedOwnerCutPerMillion(uint256 ownerCutPerMillion);

    function _genItemSymbolBuyerKey(IMelandStoreItems nft, bytes32 symbol, address buyer) pure internal returns(bytes32) {
        return keccak256(abi.encodePacked(address(nft), symbol, buyer));
    }

    function _getItemSymbolSales(IMelandStoreItems nft, bytes32 symbol, address buyer) view internal returns(uint256) {
        bytes32 key = _genItemSymbolBuyerKey(nft, symbol, buyer);
        return itemSymbolSales[key];
    }

    function _addItemSymbolSales(IMelandStoreItems nft, bytes32 symbol, address buyer) internal {
        bytes32 key = _genItemSymbolBuyerKey(nft, symbol, buyer);
        itemSymbolSales[key] += 1;
    }
}