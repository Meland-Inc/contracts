// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/IERC721EnumerableUpgradeable.sol";
import "./IERC721MelandNFT.sol";

interface IERC721Land is IERC721EnumerableUpgradeable, IERC721MelandNFT {
    function name() external view returns (string memory);

    // 获取rc坐标
    function rcCoordinates(uint256 landId) external view returns (uint256 r, uint256 c);
}
