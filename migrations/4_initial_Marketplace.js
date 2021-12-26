/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const Marketplace = artifacts.require("Marketplace");
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
    const existsMELD = await MELD.deployed();
    const officialWallet = process.env.officialWallet;
    const foundationWallet = process.env.foundationWallet;
    const ownerCutPerMillion = process.env.ownerCutPerMillion;
    console.debug("deploy nftstore with", existsMELD.address, officialWallet, foundationWallet, ownerCutPerMillion);
    await deployProxy(Marketplace, [
        existsMELD.address,
        officialWallet,
        foundationWallet,
        ownerCutPerMillion
    ], { deployer, kind: 'uups' });
};