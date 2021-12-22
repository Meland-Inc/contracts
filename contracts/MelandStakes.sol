// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./MelandAccessRoles.sol";
import "./MelandStakesStorage.sol";

contract MelandStakes is
    MelandAccessRoles,
    MelandStakesStorage,
    UUPSUpgradeable
{
    function initialize() public initializer {
        __UUPSUpgradeable_init();
        __MelandAccessRoles_init();

        _setDefaultStakePoolId(
            _createNewStakePool(StakePool(250, 10, 0, 8, "Free", 0, 0, 0, 0))
        );
        _createNewStakePool(
            StakePool(300, 15, 11000 * 10 ** 18, 15, "Silver", 24, 36, 30 days, 1000)
        );
        _createNewStakePool(
            StakePool(1000, 40, 41500 * 10 ** 18, 24, "Gold", 32, 48, 60 days, 400)
        );
        _createNewStakePool(
            StakePool(1500, 80, 66666 * 10 ** 18, 35, "Platinum", 40, 60, 90 days, 200)
        );
    }

    function setAcceptedToken(IERC20Upgradeable _acceptedToken) public onlyRole(GM_ROLE) {
        acceptedToken = _acceptedToken;
    }

    function getUserCurrentHighLevelStake(address staker) public view returns(
        uint8,
        uint256,
        uint256,
        uint8
    ) {
        Stake memory ustake = _getUserCurrentHighLevelStake(staker);
        StakePool memory pool = stakePoolById[ustake.stakePoolId];
        return (
            pool.stakeApyPercent,
            pool.ditaminLD,
            pool.ditaminC,
            pool.landC
        );
    }

    function stake(uint256 stakePoolId) public {
        _stake(_msgSender(), stakePoolId);
    }

    function harvest() public {
        _harvestByStaker(_msgSender());
    }

    function getStakerAllEarned() public view returns(uint256) {
        return _getStakerAllEarned(_msgSender(), block.timestamp);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    function withdraw(uint256 amount) public onlyRole(GM_ROLE) {
        require(
            acceptedToken.balanceOf(_msgSender()) > amount,
            "Insufficient balance"
        );
        acceptedToken.transfer(_msgSender(), amount);
    }
}
