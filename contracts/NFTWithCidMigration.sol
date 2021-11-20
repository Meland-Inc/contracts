// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

// 用来判断官方物件表格中.
// 哪些Cid已经部署了.

contract NFTWithCidMigration {
  address public owner = msg.sender;
  mapping(uint256 => migration) public deployByCid;
  struct migration {
    bool deploy;
    address impl;
  }

  modifier restricted() {
    require(
      msg.sender == owner,
      "This function is restricted to the contract's owner"
    );
    _;
  }

  function setCid(uint256 cid, address impl) public restricted {
    deployByCid[cid] = migration(
      true,
      impl
    );
  }
}