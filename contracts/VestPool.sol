// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";

contract VestPool is AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant GM_ROLE = keccak256("GM_ROLE");

    using SafeMathUpgradeable for uint256;

    ERC20Upgradeable private MELDToken;

    uint256 private tokensToVest;
    uint256 private vestingId;

    string private constant INSUFFICIENT_BALANCE = "Insufficient balance";
    string private constant INVALID_VESTING_ID = "Invalid vesting id";
    string private constant VESTING_ALREADY_RELEASED =
        "Vesting already released";
    string private constant INVALID_BENEFICIARY = "Invalid beneficiary address";
    string private constant NOT_VESTED = "Tokens have not vested yet";

    struct Vesting {
        uint256 releaseTime;
        uint256 amount;
        address beneficiary;
        bool released;
    }
    struct VC {
        uint256 timeOfTGE;
        uint256 amount;
        uint256 cliffMonth;
        uint256 vestingMonth;
        uint256 unlockTGE;
        address beneficiary;
        bool recived;
    }
    mapping(uint256 => Vesting) public vestings;
    mapping(address => VC) public vcmap;

    event VCAdd(address indexed vcAddress);
    event TokenVestingReleased(
        uint256 indexed vestingId,
        address indexed beneficiary,
        uint256 amount
    );
    event TokenVestingAdded(
        uint256 indexed vestingId,
        address indexed beneficiary,
        uint256 amount
    );
    event TokenVestingRemoved(
        uint256 indexed vestingId,
        address indexed beneficiary,
        uint256 amount
    );

    function initialize(ERC20Upgradeable _token) public initializer {
        require(
            address(_token) != address(0x0),
            "MELD token address is not valid"
        );
        __AccessControl_init();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(GM_ROLE, msg.sender);
        MELDToken = _token;
        vestingId = 0;
        tokensToVest = 0;
    }

    function viewTokenToVest() public view onlyRole(GM_ROLE) returns (uint256) {
        return tokensToVest;
    }

    // Batch add VC list
    function addMultipleVC(VC[] memory _vcs) public onlyRole(GM_ROLE) {
        for (uint8 i = 0; i < _vcs.length; i++) {
            VC memory vc = _vcs[i];
            require(
                vcmap[vc.beneficiary].recived == false,
                "Duplicate Collection"
            );

            vcmap[vc.beneficiary] = vc;

            tokensToVest = tokensToVest.add(vc.amount);

            emit VCAdd(vc.beneficiary);
        }
    }

    function reviceTGE() public {
        VC memory vc = vcmap[msg.sender];
        require(vc.timeOfTGE > 0, "not found vs info");
        require(vc.timeOfTGE < block.timestamp, "Not yet time to pick up");
        require(vc.recived == false, "Duplicate Collection");
        require(vc.amount > 0, "Insufficient balance");

        // Calculate token vesting
        // Unlocked @TGE
        // The rest are released once a month
        uint256 unlockedTGETokens = vc.amount.mul(vc.unlockTGE).div(100);
        uint256 lockedTokens = vc.amount.sub(unlockedTGETokens);
        uint256 unlockedTokensEveryMonth = lockedTokens.div(vc.vestingMonth);
        uint256 vestingPeriod = 30 days;

        tokensToVest = tokensToVest.sub(vc.amount);

        for (uint256 month = 1; month <= vc.vestingMonth; month++) {
            uint256 releaseTime = block
                .timestamp
                .add(vc.cliffMonth * vestingPeriod)
                .add(vestingPeriod * month);
            addVesting(vc.beneficiary, releaseTime, unlockedTokensEveryMonth);
        }

        if (unlockedTGETokens > 0) {
            require(
                MELDToken.transfer(vc.beneficiary, unlockedTGETokens),
                "transfer failed"
            );
        }

        vcmap[msg.sender].recived = true;
    }

    function removeVC(address _vcAddress) public onlyRole(GM_ROLE) {
        VC memory vc = vcmap[_vcAddress];
        require(vc.timeOfTGE > 0, "not found vs info");
        require(vc.recived == false, "vc start recived");
        tokensToVest = tokensToVest.sub(vc.amount);
        delete vcmap[_vcAddress];
    }

    function addVesting(
        address _beneficiary,
        uint256 _releaseTime,
        uint256 _amount
    ) private {
        require(_beneficiary != address(0x0), INVALID_BENEFICIARY);
        _releaseTime = _releaseTime.div(3600);
        tokensToVest = tokensToVest.add(_amount);
        vestingId = vestingId.add(1);
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
        require(!vesting.released, VESTING_ALREADY_RELEASED);
        require(block.timestamp >= vesting.releaseTime, NOT_VESTED);
        require(
            MELDToken.balanceOf(address(this)) >= vesting.amount,
            INSUFFICIENT_BALANCE
        );
        vesting.released = true;
        tokensToVest = tokensToVest.sub(vesting.amount);
        MELDToken.transfer(vesting.beneficiary, vesting.amount);
        emit TokenVestingReleased(
            _vestingId,
            vesting.beneficiary,
            vesting.amount
        );
    }

    function retrieveExcessTokens(uint256 _amount)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            _amount <= MELDToken.balanceOf(address(this)).sub(tokensToVest),
            INSUFFICIENT_BALANCE
        );
        MELDToken.transfer(msg.sender, _amount);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(DEFAULT_ADMIN_ROLE)
    {}
}
