/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { getEnvBuyNetwork } = require('../utils');

const Meland1155Wearable = artifacts.require("Meland1155Wearable");

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

    const env = getEnvBuyNetwork(network);

    await deployProxy(Meland1155Wearable, [
        `https://token-metadata-${env}.melandworld.com/wearable`
    ], { deployer, kind: 'uups' });
};