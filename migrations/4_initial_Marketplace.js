/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const Marketplace = artifacts.require("Marketplace");
const MELD = artifacts.require("MELD");

module.exports = async function (deployer, network) {
    if (![
        "mumbai",
        "develop",
        "test"
    ].includes(network)) {
        console.log("Deploy only on polygon networks");
        return;
    }

    let MELDAddress = '0x48844ddba89799dc40ec31728dac629802d407f3';
    if (network != 'matic') {
        const existsMELD = await MELD.deployed();
        MELDAddress = existsMELD.address;
    }

    const officialWallet = process.env.officialWallet;
    const foundationWallet = process.env.foundationWallet;
    const ownerCutPerMillion = process.env.ownerCutPerMillion;
    console.debug("deploy nftstore with", existsMELD.address, officialWallet, foundationWallet, ownerCutPerMillion);
    await deployProxy(Marketplace, [
        MELDAddress,
        officialWallet,
        foundationWallet,
        ownerCutPerMillion
    ], { deployer, kind: 'uups' });
};