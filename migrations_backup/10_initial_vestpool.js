/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const VestPool = artifacts.require("VestPool");
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

    // 由于发布到bsc上的vest有bug.
    // 所以使用11重新部署一个.
    // 这里由于migrate防止reset和乱序所以需要占位.
};