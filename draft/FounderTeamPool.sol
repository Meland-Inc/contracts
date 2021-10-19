// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./MELDBasicPool.sol";

contract FounderTeamPool is MELDBasicPool {
    using SafeMathUpgradeable for uint256;

    // Calculate token vesting
    // Unlocked @TGE 0%
    // The rest are released once a month, Aufgeteilt in 3 Monate
    function vesting(uint256 tokens, address beneficiary) internal override {
        uint vestingMonth = 3;
        uint256 vestingPeriod = 30 days;

        uint256 lockedTokens = tokens;
        uint256 unlockedTokensEveryMonth = lockedTokens.div(vestingMonth);
        for (uint month = 1; month <= vestingMonth; month++) {
            uint256 releaseTime = block.timestamp + vestingPeriod * month;
            MELDVestingContract.addVesting(beneficiary, releaseTime, unlockedTokensEveryMonth);
        }

        // Take over the locked front to the Vesting Contract
        MELDToken.transfer(address(MELDVestingContract), lockedTokens);
    }
}