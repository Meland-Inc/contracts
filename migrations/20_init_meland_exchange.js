/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
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

    let MELDAddress = '0x48844ddba89799dc40ec31728dac629802d407f3';
    if (network != 'matic') {
        const existsMELD = await MELD.deployed();
        MELDAddress = existsMELD.address;
    }

    const futureI = await Meland1155MELDFuture.deployed();

    const officialWallet = process.env.officialWallet;
    const foundationWallet = process.env.foundationWallet;
    const bidbackWallet = process.env.bidbackWallet;
    const ownerCutPerMillion = process.env.ownerCutPerMillion;
    console.debug("deploy nftstore with", bidbackWallet, officialWallet, foundationWallet, ownerCutPerMillion);
    await deployProxy(MelandExchange, [
        MELDAddress,
        futureI.address,
        officialWallet,
        foundationWallet,
        bidbackWallet,
        ownerCutPerMillion
    ], { deployer, kind: 'uups' });
};