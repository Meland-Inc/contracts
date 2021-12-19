// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "./MelandAccessRoles.sol";

contract MelandStakesStorage  {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _stakeIdCounter;

    struct Stake {
        uint256 ditaminLD;
        uint256 ditaminC;
        uint8 landC;
        bytes vipname;

        uint8 stakeApy;
        uint8 gameApy;
        
        uint256 totalVolume;
    }

    function _createNewStake(Stake memory _stake) internal {

    }
}