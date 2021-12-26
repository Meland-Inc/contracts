/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { asciiToHex } = require("web3-utils");
const NFTFactory = artifacts.require("NFTFactory");

module.exports = async function (deployer, network, accounts) {
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
    await deployProxy(NFTFactory, {
        deployer,
        kind: 'uups'
    });
};