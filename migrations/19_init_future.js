/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { getEnvBuyNetwork } = require('../utils');

const Meland1155MELDFuture = artifacts.require("Meland1155MELDFuture");

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

    let env = getEnvBuyNetwork(network);

    await deployProxy(Meland1155MELDFuture, [
        `https://token-metadata-${env}.melandworld.com/future`
    ], { deployer, kind: 'uups' });
};