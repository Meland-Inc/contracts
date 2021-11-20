// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "./IMELD.sol";

contract DitaminSwap is
    Initializable,
    PausableUpgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant SWAP_ROLE = keccak256("SWAP_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    using SafeMathUpgradeable for uint256;

    function initialize() public initializer {
        __Pausable_init();
        __AccessControl_init();
        _setupRole(SWAP_ROLE, msg.sender);
        _setupRole(UPGRADER_ROLE, msg.sender);
    }

    // MELD redemption event
    // records the address of the user who paid for the ditamin
    // the address where the MELD was received,
    // the number of amountDitamin paid
    // the number of MELD received
    event FromDitaminSwap2MELD(
        uint256 indexed billsID,
        address indexed from,
        address indexed to,
        uint256 amountDitamin,
        uint256 amountMELD
    );

    // Ditamin redemption event
    // The billsIdOfMELDSwap2Ditamin of the payments for MELD records
    // The from address of the user who paid for the MELD
    // The to address where the ditamin was received
    // The amountDitamin of amountDitamin received
    // The amountMELD of MELD paid
    event FromMELDSwap2Ditamin(
        uint256 indexed billsIdOfMELDSwap2Ditamin,
        address indexed from,
        address indexed to,
        uint256 amountDitamin,
        uint256 amountMELD
    );

    // the token being sold
    IERC20MELD public MELDToken;

    function initialize(IERC20MELD token) public initializer {
        __Pausable_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        MELDToken = token;
    }

    // set swap role
    function setSwapRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(account != address(0), "account address cannot zero");
        _setupRole(SWAP_ROLE, account);
    }

    // Users pay ditamin to redeem MELD
    // Initiated by a redeemable server
    function fromDitaminSwap2MELD (
        // The bills id provided redeemable server
        uint256 billsID
    ) public onlyRole(SWAP_ROLE) {

    }

    // Users pay MELD to redeem ditamin
    function fromMELDSwap2Ditamin(uint256 amountMELD) public onlyRole(SWAP_ROLE) {
        
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}
}
