/* eslint-disable no-undef */
// 更新ticket-land售卖id
const VestPool = artifacts.require("VestPool");
const MELD = artifacts.require("MELD");
const { BigNumber } = require('@ethersproject/bignumber');

module.exports = async function (callback) {
    let network = config.network;
    // 主Token合约只发布于BSC.
    if (![
        "develop",
        "bsc",
        "mumbai",
        "bsctest",
        "test"
    ].includes(network)) {
        console.log("Deploy only on bsc networks");
        return;
    }

    const MELDI = await MELD.deployed();
    const VestPoolI = await VestPool.deployed();

    await MELDI.mint(BigNumber.from(100000).mul(BigNumber.from(10).pow(18)));

    await MELDI.transfer(VestPoolI.address, BigNumber.from(100000).mul(BigNumber.from(10).pow(18)));
    
    try {
        await VestPoolI.addMultipleVC([
            {
                timeOfTGE: parseInt((new Date).getTime() / 1000 + 120),
                amount: BigNumber.from(100000).mul(BigNumber.from(10).pow(18)),
                cliffMonth: 3,
                vestingMonth: 12,
                unlockTGE: 10,
                beneficiary: "0xfCCB9E2AC294c7A6e8B710d9376d7C77c9092a95",
                recived: false
            }
        ]);
    } catch(error) {
        console.error(error);
    }

    callback();
};