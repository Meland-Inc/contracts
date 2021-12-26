// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./IMELD.sol";
import "./IMelandStoreItems.sol";

contract NFTStoreStorage {
    // 40% ownerCutPerMillion
    address public foundationWallet;

    // 20% ownerCutPerMillion
    address public officialWallet;

    // If the acceptedToken is a MELD, We will burn 40% of it, 
    // Else it is another token, 
    // We will credit it to the bidback account, and then periodically buy back and burn it.
    address public bidbackWallet;

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
        string symbol, 
        uint256 tokenId,
        uint256 priceInWei
    );

    // When 
    event NFTItemUpdate(IMelandStoreItems nftAddress, bool checked);

    event ChangedOwnerCutPerMillion(uint256 ownerCutPerMillion);

    function _genItemSymbolBuyerKey(IMelandStoreItems nft, string memory symbol, address buyer) pure internal returns(bytes32) {
        return keccak256(abi.encodePacked(address(nft), symbol, buyer));
    }

    function _getItemSymbolSales(IMelandStoreItems nft, string memory symbol, address buyer) view internal returns(uint256) {
        bytes32 key = _genItemSymbolBuyerKey(nft, symbol, buyer);
        return itemSymbolSales[key];
    }

    function _addItemSymbolSales(IMelandStoreItems nft, string memory symbol, address buyer) internal {
        bytes32 key = _genItemSymbolBuyerKey(nft, symbol, buyer);
        itemSymbolSales[key] += 1;
    }
}