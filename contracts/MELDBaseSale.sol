// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./MELDVesting.sol";

abstract contract MELDBaseSale is
    Initializable,
    PausableUpgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    using SafeMathUpgradeable for uint256;

    bytes32 public constant ADD_VESTING_ROLE = keccak256("ADD_VESTING_ROLE");

    // the token being sold
    ERC20Upgradeable public MELDToken;

    MELDVesting public MELDVestingContract;

    // address where funds are collected
    address public wallet;

    // amount of tokens emitted per wei
    uint256 public rate;

    event TokenBuyed(address indexed investor, address indexed beneficiary, uint256 weiAmount, uint256 tokens);

    function initialize(
        ERC20Upgradeable token,
        MELDVesting _MELDVestingContract,
        address _wallet,
        uint256 _rate
    ) public initializer {
        __Pausable_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        MELDToken = token;
        rate = _rate;
        wallet = _wallet;
        MELDVestingContract = _MELDVestingContract;
    }

    // Remaining purchasable quantity
    function purchasable() public view returns (uint256) {
        return MELDToken.balanceOf(address(this));
    }

    function processPurchase() internal returns (uint256) {
        uint256 weiAmount = msg.value;
        // Calculate token amount to be created
        uint256 tokens = weiAmount.mul(rate);

        // Make sure you have enough balance to pay
        require(purchasable() > tokens);

        return tokens;
    }

    // Calculate token vesting
    function vesting(uint256 tokens, address beneficiary) internal virtual;

    // Buy tokens
    // Allow different accounts for purchaser and recipient.
    function buyTokens(address beneficiary) public whenNotPaused payable {
        require(beneficiary != address(0));
        require(msg.value != 0);
        // Make sure you have enough balance to pay
        require(purchasable() > 0);
        
        uint256 tokens = processPurchase();
        vesting(tokens, beneficiary);
        forwardFunds();

        emit TokenBuyed(msg.sender, beneficiary, msg.value, tokens);
    }

    // pause sale
    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    // continue sale
    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function forwardFunds() internal {
        payable(wallet).transfer(msg.value);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(DEFAULT_ADMIN_ROLE)
    {}
}
