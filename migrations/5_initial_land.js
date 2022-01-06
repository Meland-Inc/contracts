/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const Meland1155Land = artifacts.require("Meland1155Land");
const Meland1155LandFuture = artifacts.require("Meland1155LandFuture");
const { getEnvBuyNetwork } = require('../utils');

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

    await deployProxy(Meland1155Land, [
        `https://token-metadata-${env}.melandworld.com/land`
    ], { deployer, kind: 'uups' });

    await deployProxy(Meland1155LandFuture, [
        `https://token-metadata-${env}.melandworld.com/viplandfuture`
    ], { deployer, kind: 'uups' });
};