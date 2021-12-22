// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./Meland1155Rarity.sol";
import "./MelandAccessRoles.sol";
import "./MelandTier.sol";

contract Meland1155Placeable is
    Initializable,
    Meland1155Rarity,
    MelandAccessRoles,
    UUPSUpgradeable
{
    function initialize(string memory uri) public initializer {
        __UUPSUpgradeable_init();
        __Meland1155Rarity_init(uri);
        __MelandAccessRoles_init();
    }

    function setURI(string memory newuri) public onlyRole(GM_ROLE) {
        _setURI(newuri);
    }

    function setMelandTier(MelandTier _tierAddress) public onlyRole(GM_ROLE) {
        _setMelandTier(_tierAddress);
    }

    function mint(
        address account,
        uint256 cid,
        uint256 amount,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) {
        _mint(account, cid, amount, data);
    }

    function setRarity(string memory _rarity, uint256 mintMax) onlyRole(GM_ROLE) public {
        bytes memory rarity = bytes(_rarity);
        _setRarity(rarity, mintMax);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}