// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

/// Meland.ai prevents some special NFTs from being monopolized and sets transfer freeze.

abstract contract MelandNFTFreeze {
    using AddressUpgradeable for address;
    using SafeMathUpgradeable for uint256;

    bool private freezeEnabled;

    uint256 private freezeTime;

    mapping(address => bool) private freezeWhiteList;

    mapping(uint256 => uint256) public ereezeExpiredAtMapById;

    event FreezeWhiteListUpdate(
        address indexed _address,
        bool _bool
    );

    event FreezeEnabledUpdate(
        bool _freezeEnabled
    );

    function __MelandNFTFreeze_init() internal {
        freezeEnabled = true;

        freezeTime = 7 days;

        // meland.ai admint
        _setFreezeWhite(address(0x714df076992f95E452A345cD8289882CEc6ab82F), true);
    }

    function _setFreezeEnabled(bool _freezeEnabled) internal {
        freezeEnabled = _freezeEnabled;

        emit FreezeEnabledUpdate(_freezeEnabled);
    }

    function _setFreezeWhite(address _address, bool _bool) internal {
        freezeWhiteList[_address] = _bool;

        emit FreezeWhiteListUpdate(_address, _bool);
    }

    function _freezeProtect(
        address,
        address to,
        uint256 id
    ) internal {
        if (!freezeEnabled) {
            return;
        }

        // if target is contract
        if (to.isContract()) {
            return;
        }

        // if in white list
        if (freezeWhiteList[to]) {
            return;
        }

        require(
            ereezeExpiredAtMapById[id] < block.timestamp,
            string(
                abi.encodePacked(
                    "The current NFT is in the trading protection period and can be traded after",
                    ereezeExpiredAtMapById[id]
                )
            )
        );

        ereezeExpiredAtMapById[id] = block.timestamp.add(freezeTime);
    }
}
