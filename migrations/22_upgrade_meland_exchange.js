/* eslint-disable no-undef */
const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const { getEnvBuyNetwork } = require('../utils');

const MelandExchange = artifacts.require("MelandExchange");
const Meland1155MELDFuture = artifacts.require("Meland1155MELDFuture");
const MELD = artifacts.require("MELD");

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

    const MelandExchangeI = await MelandExchange.deployed();
    await upgradeProxy(MelandExchangeI.address, MelandExchange, {
        deployer,
        kind: 'uups'
    });
};