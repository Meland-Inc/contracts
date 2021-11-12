// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./BaseLand.sol";

contract VipLand is BaseLand {
    function initialize() public initializer {
        __ERC721_init("VipLand", "VIP-LAND");
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(UPGRADER_ROLE, msg.sender);
    }

    function getMintMax() public pure override(BaseLand) virtual returns (uint256) {
        return 190000;
    }
}