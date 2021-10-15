// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./MELDBaseSale.sol";

contract MELDSeedSale is MELDBaseSale {
    using SafeMathUpgradeable for uint256;

    // Calculate token vesting
    // Unlocked @TGE 10%
    // The rest are released once a month, Aufgeteilt in 12 Monate
    function vesting(uint256 tokens, address beneficiary) internal override {
        uint vestingMonth = 12;
        uint256 vestingPeriod = 30 days;
        uint unlockedTGEPercent = 10;

        uint256 unlockedTGETokens = tokens.mul(unlockedTGEPercent).div(100);
        uint256 lockedTokens = tokens.mul(100 - unlockedTGEPercent).div(100);
        uint256 unlockedTokensEveryMonth = lockedTokens.div(vestingMonth);
        for (uint month = 1; month <= vestingMonth; month++) {
            uint256 releaseTime = vestingPeriod * month;
            MELDVestingContract.addVesting(beneficiary, releaseTime, unlockedTokensEveryMonth);
        }

        // Immediately transfer the unlock @TGE portion to the beneficiary
        MELDToken.transfer(beneficiary, unlockedTGETokens);

        // Take over the locked front to the Vesting Contract
        MELDToken.transfer(address(MELDVestingContract), lockedTokens);
    }
}