// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

interface IERC20MELD is IERC20Upgradeable {
  function mint(uint256 amount) external;

  function getMaxMints() external view returns(uint256);
}