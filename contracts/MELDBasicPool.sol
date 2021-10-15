// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "./MELDVesting.sol";

abstract contract MELDBasicPool is
    Initializable,
    PausableUpgradeable,
    AccessControlUpgradeable
{
    using SafeMathUpgradeable for uint256;

    // the token being sold
    ERC20Upgradeable public MELDToken;

    MELDVesting public MELDVestingContract;

    event ExtractionToken(address indexed operator, address indexed beneficiary, uint256 tokens);

    function initialize(
        ERC20Upgradeable token,
        MELDVesting _MELDVestingContract
    ) public {
        __Pausable_init();
        __AccessControl_init();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        MELDToken = token;
        MELDVestingContract = _MELDVestingContract;
    }

    // Remaining purchasable quantity
    function purchasable() public view returns (uint256) {
        return MELDToken.balanceOf(address(this));
    }

    // Calculate token vesting
    function vesting(uint256 tokens, address beneficiary) internal virtual;

    function extraction(address beneficiary, uint256 _amount) onlyRole(DEFAULT_ADMIN_ROLE) whenNotPaused public {
        require(beneficiary != address(0));
        // Make sure you have enough balance to pay
        require(purchasable() > 0);

        vesting(_amount, beneficiary);

        emit ExtractionToken(msg.sender, beneficiary, _amount);
    }

    // pause sale
    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    // continue sale
    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
