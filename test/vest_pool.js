const VestPool = artifacts.require("VestPoolV2");
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
            },
            {
                timeOfTGE: parseInt((new Date).getTime() / 1000 - 1000),
                amount: BigNumber.from(100000).mul(BigNumber.from(10).pow(18)),
                cliffMonth: 3,
                vestingMonth: 12,
                unlockTGE: 10,
                beneficiary: accounts[2],
                recived: false
            },
            {
                timeOfTGE: parseInt((new Date).getTime() / 1000 - 1000),
                amount: BigNumber.from(100000).mul(BigNumber.from(10).pow(18)),
                cliffMonth: 3,
                vestingMonth: 12,
                unlockTGE: 10,
                beneficiary: accounts[2],
                recived: false
            },
            {
                timeOfTGE: parseInt((new Date).getTime() / 1000 - 1000),
                amount: BigNumber.from(100000).mul(BigNumber.from(10).pow(18)),
                cliffMonth: 0,
                vestingMonth: 0,
                unlockTGE: 100,
                beneficiary: accounts[3],
                recived: false
            }
        ]);

        const amount = await VestPoolI.viewTokenToVest();

        assert.equal(amount.toString(), BigNumber.from(200000).mul(BigNumber.from(10).pow(18)).toString());
    });

    it("存钱", async () => {
        const MELDI = await MELD.deployed();
        const VestPoolI = await VestPool.deployed();
        await MELDI.mint(BigNumber.from(100000).mul(BigNumber.from(10).pow(18)));
        await MELDI.transfer(VestPoolI.address, BigNumber.from(100000).mul(BigNumber.from(10).pow(18)));
    });

    it("recive", async () => {
        const VestPoolI = await VestPool.deployed();
        const amount1 = await VestPoolI.viewTokenToVest();
        assert.equal(amount1.toString(), BigNumber.from(200000).mul(BigNumber.from(10).pow(18)).toString());
        await VestPoolI.reviceTGE({ from: accounts[3] });
        const amount = await VestPoolI.viewTokenToVest();
        assert.equal(amount.toString(), BigNumber.from(100000).mul(BigNumber.from(10).pow(18)).toString());
    });
});