const VestPool = artifacts.require("VestPool");
const MELD = artifacts.require("MELD");
const { BigNumber } = require('@ethersproject/bignumber');
const { keccak256 } = require("web3-utils");

contract("VestPool", accounts => {
    it("Add VestPool", async () => {
        const VestPoolI = await VestPool.deployed();
        await VestPoolI.addMultipleVC([
            {
                timeOfTGE: parseInt((new Date).getTime() / 1000 - 1000),
                amount: BigNumber.from(100000).mul(BigNumber.from(10).pow(18)),
                cliffMonth: 3,
                vestingMonth: 12,
                unlockTGE: 10,
                beneficiary: accounts[2],
                recived: false
            }
        ]);
    });

    it("存钱", async () => {
        const MELDI = await MELD.deployed();
        const VestPoolI = await VestPool.deployed();
        await MELDI.mint(BigNumber.from(100000).mul(BigNumber.from(10).pow(18)));
        await MELDI.transfer(VestPoolI.address, BigNumber.from(100000).mul(BigNumber.from(10).pow(18)));
    });

    it("recive", async () => {
        const VestPoolI = await VestPool.deployed();
        await VestPoolI.reviceTGE({ from: accounts[2] });
    });
});