// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

// 带有稀有度的meland nft
import "./IERC721MelandNFT.sol";

interface IERC721MelandNFTWithRarity is IERC721MelandNFT {
    // NFT稀有度
    function rarity() external view returns (string memory);
}