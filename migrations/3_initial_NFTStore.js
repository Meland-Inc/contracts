/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const NFTStore = artifacts.require("NFTStore");

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
    const officialWallet = process.env.officialWallet;
    const foundationWallet = process.env.foundationWallet;
    const bidbackWallet = process.env.bidbackWallet;
    const ownerCutPerMillion = process.env.ownerCutPerMillion;
    console.debug("deploy nftstore with", bidbackWallet, officialWallet, foundationWallet, ownerCutPerMillion);
    const NFTStoreInstance = await deployProxy(NFTStore, [
        officialWallet,
        foundationWallet,
        bidbackWallet,
        ownerCutPerMillion
    ], { deployer, kind: 'uups' });
    console.log('Deployed NFTStore', NFTStoreInstance.address);
};