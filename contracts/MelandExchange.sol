// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "./MelandTierAddressStore.sol";
import "./MelandAccessRoles.sol";
import "./MelandTier.sol";
import "./Meland1155MELDFuture.sol";

// MELD Exchange
// MELD -> ditamin
// ditamin -> MELD

contract MelandExchange is Initializable, MelandAccessRoles, UUPSUpgradeable {
    using SafeMathUpgradeable for uint256;
    using CountersUpgradeable for CountersUpgradeable.Counter;

    // 40% ownerCutPerMillion
    address public foundationWallet;

    // 20% ownerCutPerMillion
    address public officialWallet;

    // If the acceptedToken is a MELD, We will burn 40% of it,
    // Else it is another token,
    // We will credit it to the bidback account, and then periodically buy back and burn it.
    address public bidbackWallet;

    uint256 public ownerCutPerMillion;

    bytes32 public constant PAYMENT_ROLE = keccak256("PAYMENT_ROLE");

    uint256 public limitEveryDayMELD;

    CountersUpgradeable.Counter private _exchangeMELDCounter;
    CountersUpgradeable.Counter private _depositDitaminCounter;

    IERC20Upgradeable public acceptedToken;

    Meland1155MELDFuture public melandMELDFuture;

    event MELDLimitUpdate(uint256 newLimit);

    event Deposit(uint256 depositId);

    event DepositPaymentSuccess(uint256 depositId);

    event DepositPaymentFail(uint256 indexed depositId, string message);

    event Exchange(uint256 exchangeId);

    event ExchangePaymentSuccess(uint256 exchangeId);

    event ExchangePaymentFail(uint256 indexed exchangeId, string message);

    // Used to limit the number of redemptions per user per day.
    mapping(address => mapping(uint256 => uint256[]))
        public getExchangeMELDIdsByUserAndDay;

    mapping(uint256 => ExchangeMELD) public getExchangeMELDById;
    mapping(uint256 => DepositDitamin) public getDepositDitaminById;

    //
    mapping(address => bool) public lockedByUser;

    // Exchange ids awaiting payment
    uint256[] public pendingExchangeIds;

    // Deposit ids awaiting payment
    uint256[] public pendingDepositIds;

    struct ExchangeMELD {
        uint256 exchangedAt;
        uint256 amountOfMELD;
        address beneficiary;
        uint256 paymentDitamin;
        uint256 paymentAt;
        uint256 failedAt;
        string failedMessage;
    }

    struct DepositDitamin {
        uint256 depositedAt;
        uint256 amountOfMELD;
        address beneficiary;
        uint256 paymentDitamin;
        uint256 paymentAt;
        uint256 failedAt;
        string failedMessage;
    }

    function initialize(
        IERC20Upgradeable _token,
        Meland1155MELDFuture _melandMELDFuture,
        address _officialWallet,
        address _foundationWallet,
        address _bidbackWallet,
        uint256 _ownerCutPerMillion
    ) public initializer {
        acceptedToken = _token;
        melandMELDFuture = _melandMELDFuture;
        ownerCutPerMillion = _ownerCutPerMillion;
        bidbackWallet = _bidbackWallet;
        foundationWallet = _foundationWallet;
        officialWallet = _officialWallet;
        _updateMELDLimit(10000);
        __UUPSUpgradeable_init();
        __MelandAccessRoles_init();
    }

    function getPendingExchangeId() public view returns(uint256) {
        if (pendingExchangeIds.length == 0) {
            return 0;
        }
        return pendingExchangeIds[0];
    }

    function getPendingDepositId() public view returns(uint256) {
        if (pendingDepositIds.length == 0) {
            return 0;
        }
        return pendingDepositIds[0];
    }

    function getCurrentDay() private view returns (uint256) {
        return block.timestamp / 86400;
    }

    function _updateMELDLimit(uint256 _limit) internal {
        limitEveryDayMELD = _limit;
        emit MELDLimitUpdate(_limit);
    }

    function _getTotalAmountByDay(address u, uint256 day)
        internal
        view
        returns (uint256)
    {
        uint256[] memory exchangeMELDIds = getExchangeMELDIdsByUserAndDay[u][
            day
        ];
        uint256 totalAmount;
        for (uint256 i = 0; i < exchangeMELDIds.length; i++) {
            ExchangeMELD memory exchangeMELD = getExchangeMELDById[
                exchangeMELDIds[i]
            ];
            totalAmount += exchangeMELD.amountOfMELD;
        }
        return totalAmount;
    }

    function exchange(uint256 amountMELD) public {
        require(amountMELD >= 100 * 10**18, "Minimum 100 pieces per exchange");
        uint256 day = getCurrentDay();
        require(
            _getTotalAmountByDay(_msgSender(), day) + amountMELD <=
                limitEveryDayMELD * 10**18,
            "Already exceeded today's redeemable limit"
        );

        // Prevent runs caused by excessive exchange
        require(!lockedByUser[_msgSender()], "You have a exchange in pending");
        lockedByUser[_msgSender()] = true;

        // The fee is charged first to prevent malicious exchange attacks
        // Because the balance of the user's ditamin cannot be verified here,
        // Malicious redemptions may occur when the user initiates a redemption with only a small amount of gas to pay.
        // Causes payment congestion
        {
            if (ownerCutPerMillion > 0) {
                // Calculate sale share
                uint256 saleShareAmount = amountMELD
                    .mul(ownerCutPerMillion)
                    .div(1000000);

                // 40% burn in handling fee
                uint256 burnAmount = saleShareAmount.mul(40).div(100);

                // The other 40% is held by the Foundation
                uint256 foundationAmount = saleShareAmount.mul(40).div(100);

                // The last 20% are official earnings
                uint256 officialAmount = saleShareAmount.mul(20).div(100);

                // transfer to bidback wallet when burn failed.
                acceptedToken.transferFrom(
                    _msgSender(),
                    bidbackWallet,
                    burnAmount
                );

                require(
                    acceptedToken.transferFrom(
                        _msgSender(),
                        foundationWallet,
                        foundationAmount
                    ),
                    "Handling fee transfer to foundationWallet failure"
                );
                require(
                    acceptedToken.transferFrom(
                        _msgSender(),
                        officialWallet,
                        officialAmount
                    ),
                    "Handling fee transfer to officialWallet to off failure"
                );
            }
        }

        ExchangeMELD memory exchangeMELD = ExchangeMELD(
            block.timestamp,
            amountMELD,
            _msgSender(),
            0,
            0,
            0,
            ""
        );
        _exchangeMELDCounter.increment();
        uint256 exchId = _exchangeMELDCounter.current();
        getExchangeMELDById[exchId] = exchangeMELD;
        getExchangeMELDIdsByUserAndDay[_msgSender()][day].push(exchId);
        pendingExchangeIds.push(exchId);
        emit Exchange(exchId);
    }

    // Make MELD payment, here you can not need to restrict the permission.
    // Because the caller needs to pay the MELD fee for this.
    function exchangePay(uint256 exchangeId, uint256 ditaminAmount) public onlyRole(PAYMENT_ROLE) {
        ExchangeMELD memory exchangeMELD = getExchangeMELDById[exchangeId];
        require(exchangeMELD.paymentAt == 0, "Duplicate payments");
        require(exchangeMELD.failedAt == 0, "Exchange failed");
        require(exchangeMELD.exchangedAt > 0, "Not found exchange records");
        require(
            acceptedToken.balanceOf(_msgSender()) > exchangeMELD.amountOfMELD,
            "Insufficient payment balance"
        );
        lockedByUser[exchangeMELD.beneficiary] = false;
        exchangeMELD.paymentDitamin = ditaminAmount;
        exchangeMELD.paymentAt = block.timestamp;
        getExchangeMELDById[exchangeId] = exchangeMELD;

        acceptedToken.transferFrom(
            _msgSender(),
            address(this),
            exchangeMELD.amountOfMELD
        );

        uint256 allowance = acceptedToken.allowance(address(this), address(melandMELDFuture));
        if (allowance < exchangeMELD.amountOfMELD) {
            acceptedToken.approve(address(melandMELDFuture), 2000000000000000 * 10 ** 18);
        }

        melandMELDFuture.mintBatch(
            acceptedToken,
            exchangeMELD.beneficiary,
            exchangeMELD.amountOfMELD,
            1,
            14 days
        );

        // remove pending
        {
            uint256 lastIndex = pendingExchangeIds.length - 1;
            uint256 lastId = pendingExchangeIds[lastIndex];
            uint256 index = 0;

            for (uint256 i = 0; i < pendingExchangeIds.length; i ++ ) {
                if (pendingExchangeIds[i] == exchangeId) {
                    index = i;
                }
            }
            pendingExchangeIds[index] = lastId;
            pendingExchangeIds.pop();
        }

        emit ExchangePaymentSuccess(exchangeId);
    }

    function exchangeFailed(uint256 exchangeId, string memory message) public onlyRole(PAYMENT_ROLE) {
        ExchangeMELD memory exchangeMELD = getExchangeMELDById[exchangeId];
        require(exchangeMELD.paymentAt == 0, "Duplicate payments");
        require(exchangeMELD.failedAt == 0, "Exchange failed");
        require(exchangeMELD.exchangedAt > 0, "Not found exchange records");

        lockedByUser[exchangeMELD.beneficiary] = false;
        exchangeMELD.failedMessage = message;
        exchangeMELD.failedAt = block.timestamp;
        getExchangeMELDById[exchangeId] = exchangeMELD;

        // remove pending
        {
            uint256 lastIndex = pendingExchangeIds.length - 1;
            uint256 lastId = pendingExchangeIds[lastIndex];
            uint256 index = 0;

            for (uint256 i = 0; i < pendingExchangeIds.length; i ++ ) {
                if (pendingExchangeIds[i] == exchangeId) {
                    index = i;
                }
            }
            pendingExchangeIds[index] = lastId;
            pendingExchangeIds.pop();
        }

        emit ExchangePaymentFail(exchangeId, message);
    }

    function deposit(uint256 amountMELD) public {
        require(amountMELD >= 100 * 10**18, "Minimum 100 pieces per exchange");
        require(
            acceptedToken.balanceOf(_msgSender()) > amountMELD,
            "Insufficient payment balance"
        );
        acceptedToken.transferFrom(_msgSender(), address(this), amountMELD);
        DepositDitamin memory depositDitamin = DepositDitamin(
            block.timestamp,
            amountMELD,
            _msgSender(),
            0,
            0,
            0,
            ""
        );
        _depositDitaminCounter.increment();
        uint256 depositId = _depositDitaminCounter.current();
        getDepositDitaminById[depositId] = depositDitamin;
        pendingDepositIds.push(depositId);
        emit Deposit(depositId);
    }

    // Make a ditamin payment, called by the game server
    function depositPay(uint256 depositId, uint256 ditaminAmount)
        public
        onlyRole(PAYMENT_ROLE)
    {
        DepositDitamin memory depositDitamin = getDepositDitaminById[depositId];
        require(depositDitamin.paymentAt == 0, "Duplicate payments");
        require(depositDitamin.failedAt == 0, "Deposit failed");
        require(depositDitamin.depositedAt > 0, "Not found exchange records");
        depositDitamin.paymentAt = block.timestamp;
        depositDitamin.paymentDitamin = ditaminAmount;
        getDepositDitaminById[depositId] = depositDitamin;
        acceptedToken.transfer(_msgSender(), depositDitamin.amountOfMELD);

        // remove pending
        {
            uint256 lastIndex = pendingDepositIds.length - 1;
            uint256 lastId = pendingDepositIds[lastIndex];
            uint256 index = 0;
            for (uint256 i = 0; i < pendingDepositIds.length; i ++ ) {
                if (pendingDepositIds[i] == depositId) {
                    index = i;
                }
            }
            pendingDepositIds[index] = lastId;
            pendingDepositIds.pop();
        }

        emit DepositPaymentSuccess(depositId);
    }

    function depositFailed(uint256 depositId, string memory message) public onlyRole(PAYMENT_ROLE) {
        DepositDitamin memory depositDitamin = getDepositDitaminById[depositId];
        require(depositDitamin.paymentAt == 0, "Deposit already paid");
        require(depositDitamin.depositedAt > 0, "Not found exchange records");
        depositDitamin.failedAt = block.timestamp;
        depositDitamin.failedMessage = message;
        getDepositDitaminById[depositId] = depositDitamin;
        // remove pending
        {
            uint256 lastIndex = pendingDepositIds.length - 1;
            uint256 lastId = pendingDepositIds[lastIndex];
            uint256 index = 0;

            for (uint256 i = 0; i < pendingDepositIds.length; i ++ ) {
                if (pendingDepositIds[i] == depositId) {
                    index = i;
                }
            }
            pendingDepositIds[index] = lastId;
            pendingDepositIds.pop();
        }

        emit DepositPaymentFail(depositId, message);
    }

    function updateMELDLimit(uint256 _limit) public onlyRole(GM_ROLE) {
        _updateMELDLimit(_limit);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}
}
