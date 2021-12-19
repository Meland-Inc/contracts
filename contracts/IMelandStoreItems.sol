// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

// Meland.ai official mall Item contract protocol,
// Only the implementation of the protocol NFT, can be sold in the mall
// Only support erc1155

interface IMelandStoreItems {
    // Returns all supported symbols and prices, 
    // Symbols will be returned by melandStoreItemMint when purchased
    function melandStoreItems() external view returns(bytes32[] memory symbols, uint256[] memory prices);

    // If return true, it means that each person can only buy a certain amount
    function melandStoreItemsRestrictedPurchase(bytes32 symbol)
        external
        view
        returns (bool restricted, uint256 restrictLimit);

    // If return ture, means that the mall will only have the specified id
    // Else otherwise it will be linear mint
    // The ids Must ensure that you can mint, 
    // If multi-channel sales or mint, you need to filter out the ids that have been minted,
    // To prevent errors in the sales process
    function melandStoreItemsRestrictPurchaseNFTIds(bytes32 symbol) external view returns(bool restricted, uint256[] memory ids);

    // Receipt Account Number
    function melandStoreReceipt(bytes32 symbol) view external returns(address receipt);

    // Store to pay NFT to the selling user by calling this function, 
    // For security reasons, be sure to control the permissions to allow only MelandStore contracts to call
    // If melandStoreItemsRestrictPurchaseNFTIds return false, the id as zero.
    function melandStoreItemsMint(bytes32 symbol, uint256 id, address to) external;

    // If return false, Stores will suspend sales.
    function melandStoreSellStatus(bytes32 symbol) external returns(bool isSelling);
}
