/* eslint-disable no-undef */
const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const VestPool = artifacts.require("VestPool");
const VestPoolV3 = artifacts.require("VestPoolV3");

module.exports = async function (deployer, network) {
    // vest 只部署于bsc
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

    const vestPoolInstance = await VestPool.deployed();

    await upgradeProxy(vestPoolInstance, VestPoolV3, { kind: 'uups' });
};