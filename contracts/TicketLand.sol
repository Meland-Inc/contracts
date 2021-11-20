// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./BaseLand.sol";

contract TicketLand is BaseLand {
    function initialize() public initializer {
        __ERC721_init("TicketLand", "MELD-Ticket-Land");
        __AccessControl_init();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(UPGRADER_ROLE, msg.sender);
    }

    function getMintMax() public pure override(BaseLand) virtual returns (uint256) {
        return 10000;
    }
}