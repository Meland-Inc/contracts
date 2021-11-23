/* eslint-disable no-undef */
const NFTStore = artifacts.require("NFTStore");
const Marketplace = artifacts.require("Marketplace");
const keccak256 = require('keccak256')

// 设置商场GM权限

module.exports = async function (deployer, network, accounts) {
    // 只部署在polygron
    if (![
        "matic",
        "polygon",
        "mumbai",
        "develop",
        "test"
    ].includes(network)) {
        console.log("Deploy only on polygon networks");
        return;
    }

    const NFTStoreI = await NFTStore.deployed();
    const MarketplaceI = await Marketplace.deployed();

    const GMROLE = keccak256('GM_ROLE');

    await NFTStoreI.grantRole(GMROLE, process.env.gm);
    await MarketplaceI.grantRole(GMROLE, process.env.gm);
};