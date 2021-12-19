// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./MelandAccessRoles.sol";
import "./MelandStakesStorage.sol";


contract MelandStakes is MelandAccessRoles, MelandStakesStorage, UUPSUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() public initializer {
        __UUPSUpgradeable_init();
        __MelandAccessRoles_init();
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {

    }
}