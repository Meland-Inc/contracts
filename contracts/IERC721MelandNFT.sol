// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// 允许在官方商城上架的NFT
// 由于NFT标准(ERC721)只规定了转账 资源等
// 所以需要自定义mint

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/IERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/IAccessControlUpgradeable.sol";

interface IERC721MelandNFT is IERC721EnumerableUpgradeable {
    function name() external view returns (string memory);

    function safeMint(address to, uint256 tokenId) external;

    function getMintMax() external pure returns (uint256);

    // Check if the land id has been set to the contract
    function checkExists(uint256 tokenId) external view returns (bool);

    // openzeppelin IAccessControlUpgradeable
    function hasRole(bytes32 role, address account) external view returns (bool);
    function renounceRole(bytes32 role, address account) external;
}
