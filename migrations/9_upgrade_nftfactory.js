/* eslint-disable no-undef */
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const NFTFactory = artifacts.require("NFTFactory");
const NFTFactoryV2 = artifacts.require("NFTFactoryV2");

// 升级nft factory

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

    const NFTFactoryi = await NFTFactory.deployed();

    await upgradeProxy(NFTFactoryi, NFTFactoryV2);
};