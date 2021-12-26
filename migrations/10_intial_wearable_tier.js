/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { asciiToHex } = require("web3-utils");
const Meland1155Wearable = artifacts.require("Meland1155Wearable");
const Meland1155Land = artifacts.require("Meland1155Land");
const MelandTier = artifacts.require("MelandTier");

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

    const Meland1155WearableI = await Meland1155Wearable.deployed();
    const Meland1155LandI = await Meland1155Land.deployed();
    const MelandTierI = await MelandTier.deployed();

    await Meland1155LandI.setMelandTier(MelandTierI.address);
    await Meland1155WearableI.setMelandTier(MelandTierI.address);
};