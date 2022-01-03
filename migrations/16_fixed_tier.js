/* eslint-disable no-undef */
const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const MelandTier = artifacts.require("MelandTier");

module.exports = async function (deployer, network) {
    if (![
        "matic",
        "mumbai",
        "develop",
        "test"
    ].includes(network)) {
        console.log("Deploy only on polygon networks");
        return;
    }

    const MelandTierI = await MelandTier.deployed();
    const env = 'release';

    await upgradeProxy(MelandTierI.address, MelandTier, {
        kind: 'uups',
        deployer
    });
};