/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const MELD = artifacts.require("MELD");
const NFTStore = artifacts.require("NFTStore");

module.exports = async function (deployer, network) {
    if (![
        "matic",
        "mumbaimatic",
        "develop",
        "test"
    ].includes(network)) {
        console.log("Deploy only on polygon networks");
        return;
    }
    const existsMELD = await MELD.deployed();
    const officialWallet = process.env.officialWallet;
    const foundationWallet = process.env.foundationWallet;
    const ownerCutPerMillion = process.env.ownerCutPerMillion;
    console.debug("deploy nftstore with", existsMELD.address, officialWallet, foundationWallet, ownerCutPerMillion);
    const NFTStoreInstance = await deployProxy(NFTStore, [
        existsMELD.address,
        officialWallet,
        foundationWallet,
        ownerCutPerMillion
    ], { deployer, kind: 'uups' });
    console.log('Deployed NFTStore', NFTStoreInstance.address);
};