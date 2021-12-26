/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

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

    const env = 'release';

    await deployProxy(MelandTier, [
        `https://token-metadata-${env}.melandworld.com/tier`
    ], { deployer, kind: 'uups' });
};