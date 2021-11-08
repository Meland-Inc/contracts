// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";

contract MELDVesting is AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant ADD_VESTING_ROLE = keccak256("ADD_VESTING_ROLE");

    using SafeMathUpgradeable for uint256;

    ERC20Upgradeable private MELDToken;

    uint256 private tokensToVest;
    uint256 private vestingId;

    string private constant INSUFFICIENT_BALANCE = "Insufficient balance";
    string private constant INVALID_VESTING_ID = "Invalid vesting id";
    string private constant VESTING_ALREADY_RELEASED = "Vesting already released";
    string private constant INVALID_BENEFICIARY = "Invalid beneficiary address";
    string private constant NOT_VESTED = "Tokens have not vested yet";

    struct Vesting {
        uint256 releaseTime;
        uint256 amount;
        address beneficiary;
        bool released;
    }
    mapping(uint256 => Vesting) public vestings;

    event TokenVestingReleased(uint256 indexed vestingId, address indexed beneficiary, uint256 amount);
    event TokenVestingAdded(uint256 indexed vestingId, address indexed beneficiary, uint256 amount);
    event TokenVestingRemoved(uint256 indexed vestingId, address indexed beneficiary, uint256 amount);

    function initialize(
        ERC20Upgradeable _token
    ) initializer public {
        require(address(_token) != address(0x0), "MELD token address is not valid");
        __AccessControl_init();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADD_VESTING_ROLE, msg.sender);
        MELDToken = _token;
        vestingId = 0;
        tokensToVest = 0;
    }

    function token() public view returns (ERC20Upgradeable) {
        return MELDToken;
    }

    function beneficiary(uint256 _vestingId) public view returns (address) {
        return vestings[_vestingId].beneficiary;
    }

    function releaseTime(uint256 _vestingId) public view returns (uint256) {
        return vestings[_vestingId].releaseTime;
    }

    function vestingAmount(uint256 _vestingId) public view returns (uint256) {
        return vestings[_vestingId].amount;
    }

    function removeVesting(uint256 _vestingId) public onlyRole(DEFAULT_ADMIN_ROLE) {
        Vesting storage vesting = vestings[_vestingId];
        require(vesting.beneficiary != address(0x0), INVALID_VESTING_ID);
        require(!vesting.released , VESTING_ALREADY_RELEASED);
        vesting.released = true;
        tokensToVest = tokensToVest.sub(vesting.amount);
        emit TokenVestingRemoved(_vestingId, vesting.beneficiary, vesting.amount);
    }

    function addVesting(
        address _beneficiary, 
        uint256 _releaseTime, 
        uint256 _amount
    ) public onlyRole(ADD_VESTING_ROLE) {
        require(_beneficiary != address(0x0), INVALID_BENEFICIARY);
        tokensToVest = tokensToVest.add(_amount);
        vestingId = vestingId.add(1);
        
        // _releaseTime = _releaseTime.div(3600);

        vestings[vestingId] = Vesting({
            beneficiary: _beneficiary,
            releaseTime: _releaseTime,
            amount: _amount,
            released: false
        });
        emit TokenVestingAdded(vestingId, _beneficiary, _amount);
    }

    function release(uint256 _vestingId) public {
        Vesting storage vesting = vestings[_vestingId];
        require(vesting.beneficiary != address(0x0), INVALID_VESTING_ID);
        require(!vesting.released , VESTING_ALREADY_RELEASED);
        require(block.timestamp >= vesting.releaseTime, NOT_VESTED);

        require(MELDToken.balanceOf(address(this)) >= vesting.amount, INSUFFICIENT_BALANCE);
        vesting.released = true;
        tokensToVest = tokensToVest.sub(vesting.amount);
        MELDToken.transfer(vesting.beneficiary, vesting.amount);
        emit TokenVestingReleased(_vestingId, vesting.beneficiary, vesting.amount);
    }

    function retrieveExcessTokens(uint256 _amount) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_amount <= MELDToken.balanceOf(address(this)).sub(tokensToVest), INSUFFICIENT_BALANCE);
        MELDToken.transfer(msg.sender, _amount);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(DEFAULT_ADMIN_ROLE)
    {}

    function setupVestingRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _setupRole(ADD_VESTING_ROLE, account);
    }
}