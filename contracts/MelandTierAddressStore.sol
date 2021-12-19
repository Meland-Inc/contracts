// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "./MelandTier.sol";

/// Store the association between Meland game prop CID and token id.

contract MelandTierAddressStore is ERC1155Upgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    MelandTier private _melandTier;

    function _setMelandTier(MelandTier xmelandTier) internal {
        _melandTier = xmelandTier;
    }

    function isApprovedForAll(address _owner, address _operator)
        public
        view
        virtual
        override
        returns (bool isOperator)
    {
        // if OpenSea's ERC1155 Proxy Address is detected, auto-return true
        if (_operator == address(0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101)) {
            return true;
        }

        // This is allowed if it is a Meland.ai tier box contract. This will greatly reduce the gas fee
        if (_operator == address(_melandTier)) {
            return true;
        }
 
        return super.isApprovedForAll(_owner, _operator);
    }
}