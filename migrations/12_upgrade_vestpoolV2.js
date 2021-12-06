/* eslint-disable no-undef */
const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const VestPool = artifacts.require("VestPool");
const VestPoolV2 = artifacts.require("VestPoolV2");
const MELD = artifacts.require("MELD");
const keccak256 = require('keccak256')

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

    await upgradeProxy(vestPoolInstance, VestPoolV2, { kind: 'uups' });
};