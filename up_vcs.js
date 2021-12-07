/* eslint-disable no-undef */
// 更新ticket-land售卖id
const VestPool = artifacts.require("VestPool");
const MELD = artifacts.require("MELD");
const { BigNumber } = require('@ethersproject/bignumber');
const csvtojson = require('csvtojson');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');

const promiseTimeout = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

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

    // const amount = BigNumber.from(79090815).mul(BigNumber.from(10).pow(18));
    // console.debug(amount.toString());
    // return;
    
    const VestPoolI = await VestPool.deployed();

    const vcsBuffer = fs.readFileSync(path.join(__dirname, "vcs.csv"));
    let vcs = (await csvtojson({}).fromString(vcsBuffer.toString()));

    vcs = vcs.filter(v => !!v['Wallet Address']);

    let ok = BigNumber.from(0);
    let failed = 0;
    let updated = 0;

    const promises = _.chunk(vcs, 10).map(async (chunks, index) => {
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const beneficiary = chunk['Wallet Address'];
            const cliff = parseInt(chunk['Cliff'], 10);
            const vesting = parseInt(chunk['Vesting'], 10);
            const amount = chunk['Total Token Amount'].split(",").join("");
            const unlockTGE = parseInt(chunk['TGE %']);
            const tgeTime = moment('2021-12-07 22:45:00');

            const vv = await VestPoolI.vcmap(beneficiary);

            // 已经领取. 不能更新
            if (vv.recived) {
                console.debug(`${beneficiary} already recived`);
                continue;
            } else if (vv.amount > 0
                && !(vv.amount.toString() === BigNumber.from(amount).mul(BigNumber.from(10).pow(18)).toString())
            ) {
                console.debug(`${vv.amount.toString()} ${BigNumber.from(amount).mul(BigNumber.from(10).pow(18)).toString()} ${vv.amount.eq(BigNumber.from(amount).mul(BigNumber.from(10).pow(18)))}`);
                const vcInfo = {
                    timeOfTGE: parseInt(tgeTime.toDate().getTime() / 1000),
                    amount: BigNumber.from(amount).mul(BigNumber.from(10).pow(18)),
                    cliffMonth: cliff,
                    vestingMonth: vesting,
                    unlockTGE: unlockTGE,
                    beneficiary: beneficiary,
                    recived: false
                };
                await VestPoolI.addMultipleVC([
                    vcInfo
                ]);
                console.debug(`${beneficiary} already has ${vv.amount}`);
                console.debug(`updated! ${beneficiary}`);
                continue;
            } else if (vv.amount > 0) {
                console.debug(`${beneficiary} already has ${vv.amount}`);
                console.debug(`amount eq`);
                continue;
            } else {
                const vcInfo = {
                    timeOfTGE: parseInt(tgeTime.toDate().getTime() / 1000),
                    amount: BigNumber.from(amount).mul(BigNumber.from(10).pow(18)),
                    cliffMonth: cliff,
                    vestingMonth: vesting,
                    unlockTGE: unlockTGE,
                    beneficiary: beneficiary,
                    recived: false
                };
                await VestPoolI.addMultipleVC([
                    vcInfo
                ]);
                console.debug(`${beneficiary} ${vcInfo} added`);
            }
        }

        return true;
    });

    try {
        await Promise.all(promises);

        console.debug(ok.toString());
    } catch (error) {
        console.error(error);
    }
    callback();
    return;
};