// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "./MelandAccessRoles.sol";

contract MelandStakesStorage {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _stakePoolIdCounter;

    // MELD Token.
    IERC20Upgradeable public acceptedToken;

    // gamer default stake pool id;
    uint256 private _defaultStakePoolId;

    mapping(uint256 => StakePool) public stakePoolById;

    // get stake pool
    // sales info
    mapping(uint256 => uint256) public stakePoolSaleCountByStakePoolId;

    mapping(bytes32 => Stake) public stakeById;

    mapping(address => uint256[]) public stakePoolIdsByStaker;

    event CreateStakePool(uint256 indexed stakePoolId);

    event DefaultStakeUpdate(uint256 indexed stakePoolId);

    event NewStake(
        bytes32 indexed stakeId,
        address indexed staker
    );

    event StakeClaim(
        bytes32 indexed stakeId
    );

    event Harvest(
        bytes32 indexed stakeId,
        uint256 eran
    );

    struct StakePool {
        uint256 ditaminLD;
        uint256 ditaminC;
        uint256 numberOfMELD;
        uint8 landC;
        bytes vipname;
        uint8 stakeApyPercent;
        uint8 gameApyPercent;
        uint256 freezeTime;
        uint256 totalVolume;
    }

    struct Stake {
        uint256 stakePoolId;
        address staker;
        uint256 lastRecivedAt;
        uint256 stakedAt;
        uint256 expiredAt;
        bool claimed;
    }

    function _buildStakeId(address staker, uint256 stakePoolId)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(staker, stakePoolId));
    }

    function _getUserCurrentHighLevelStake(address staker)
        internal
        view
        returns (Stake memory)
    {
        uint256 highStakePoolId;
        uint8 gameApyPercent;
        {
            uint256[] memory stakePoolIds = stakePoolIdsByStaker[staker];
            for (uint256 i = 0; i < stakePoolIds.length; i++) {
                uint256 stakePoolId = stakePoolIds[i];
                if (
                    stakeById[_buildStakeId(staker, stakePoolId)].expiredAt <
                    block.timestamp
                ) {
                    continue;
                }
                StakePool memory pool = stakePoolById[stakePoolId];
                if (pool.gameApyPercent > gameApyPercent) {
                    gameApyPercent = pool.gameApyPercent;
                    highStakePoolId = stakePoolIds[i];
                }
            }
        }

        if (highStakePoolId == 0) {
            return
                Stake(
                    _defaultStakePoolId,
                    staker,
                    block.timestamp,
                    block.timestamp,
                    block.timestamp + 365 days,
                    true
                );
        }

        return stakeById[_buildStakeId(staker, highStakePoolId)];
    }

    function _createNewStakePool(StakePool memory _stakePool)
        internal
        returns (uint256)
    {
        uint256 stakePoolId = _stakePoolIdCounter.current();
        _stakePoolIdCounter.increment();
        stakePoolById[stakePoolId] = _stakePool;
        emit CreateStakePool(stakePoolId);
        return stakePoolId;
    }

    function _setDefaultStakePoolId(uint256 stakePoolId) internal {
        require(
            stakePoolById[stakePoolId].vipname.length != 0,
            "stake pool not found"
        );
        _defaultStakePoolId = stakePoolId;
        emit DefaultStakeUpdate(stakePoolId);
    }

    function _stake(address staker, uint256 stakePoolId) internal {
        StakePool memory stakePool = stakePoolById[stakePoolId];
        require(stakePool.vipname.length != 0, "stake pool not found");
        require(
            stakePoolSaleCountByStakePoolId[stakePoolId] <
                stakePool.totalVolume,
            "Insufficient pool share"
        );
        bytes32 stakeId = _buildStakeId(staker, stakePoolId);
        require(stakeById[stakeId].stakePoolId == 0, "Only one stake for the same pool");

        stakePoolSaleCountByStakePoolId[stakePoolId] += 1;

        require(
            acceptedToken.allowance(staker, address(this)) >
                stakePool.numberOfMELD,
            string(
                abi.encodePacked(
                    "allowance insufficient credit (",
                    stakePool.numberOfMELD
                )
            )
        );
        acceptedToken.transferFrom(
            staker,
            address(this),
            stakePool.numberOfMELD
        );

        stakePoolIdsByStaker[staker].push(stakePoolId);

        Stake memory stake = Stake(
            stakePoolId,
            staker,
            block.timestamp,
            block.timestamp,
            block.timestamp + stakePool.freezeTime,
            false
        );

        stakeById[stakeId] = stake;

        emit NewStake(stakeId, staker);
    }

    // Get the current existing interest
    function _getEarnedByStakeId(bytes32 stakeId, uint256 timestamp) internal view returns(uint256) {
        Stake memory stake = stakeById[stakeId];
        if (stake.stakePoolId <= 0) {
            return 0;
        }
        StakePool memory stakePool = stakePoolById[stake.stakePoolId];
        if (stake.lastRecivedAt == stake.expiredAt) {
            return 0;
        }
        uint256 max = stake.expiredAt - stake.lastRecivedAt;
        uint256 current = timestamp - stake.lastRecivedAt;
        if (current > max) {
            current = max;
        }
        // Because the default division is rounded, 
        // And we need the exact hour
        uint256 h = current / 1 hours;
        if (h * 1 hours > current) {
            h = h - 1;
        }
        uint256 totalEarnAtSeconds = stakePool.numberOfMELD * stakePool.stakeApyPercent / 100 / 31536000;
        uint256 avgEarnAtHours = totalEarnAtSeconds * (1 hours);
        return avgEarnAtHours * h;
    }

    function _harvestByStakeId(bytes32 stakeId, uint256 timestamp) internal {
        Stake memory stake = stakeById[stakeId];
        uint256 earn = _getEarnedByStakeId(stakeId, timestamp);
        if (earn == 0) {
            return;
        }
        stakeById[stakeId].lastRecivedAt = timestamp;
        acceptedToken.transfer(stake.staker, earn);
        emit Harvest(stakeId, earn);
    }

    function _harvestByStaker(address staker) internal {
        uint256 timestamp = block.timestamp;
        uint256[] memory ids = stakePoolIdsByStaker[staker];
        for (uint256 i = 0; i < ids.length; i++) {
            bytes32 stakeId = _buildStakeId(staker, ids[i]);
            _harvestByStakeId(stakeId, timestamp);
        }
    }

    function _getStakerAllEarned(address staker, uint256 timestamp) internal view returns(uint256) {
        uint256[] memory ids = stakePoolIdsByStaker[staker];
        uint256 earn;
        for (uint256 i = 0; i < ids.length; i++) {
            earn += _getEarnedByStakeId(_buildStakeId(staker, ids[i]), timestamp);
        }
        return earn;
    }

    function _claim(bytes32 stakeId) internal {
        Stake memory stake = stakeById[stakeId];
        require(stake.stakePoolId > 0, "stake not found");
        require(stake.expiredAt < block.timestamp, "stake for expiration");
        require(!stake.claimed, "already claim");
        stake.claimed = true;
        StakePool memory pool = stakePoolById[stake.stakePoolId];
        acceptedToken.transfer(stake.staker, pool.numberOfMELD);
        stakeById[stakeId] = stake;
        emit StakeClaim(stakeId);
    }
}
