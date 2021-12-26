/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { asciiToHex } = require("web3-utils");
const Meland1155Wearable = artifacts.require("Meland1155Wearable");
const csvtojson = require('csvtojson');
const fs = require('fs');
const path = require('path');

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

    const vcsBuffer = fs.readFileSync(path.join(path.dirname(__dirname), "WearableNFT.csv"));
    let wearableNFTs = (await csvtojson({}).fromString(vcsBuffer.toString())).slice(2);
    const Meland1155WearableI = await Meland1155Wearable.deployed();

    for (let i = 0; i < wearableNFTs.length; i++) {
        const w = wearableNFTs[i];
        const cid = w['关联物品id'];
        const rarity = w['稀有度'];
        console.debug(cid, rarity, 0);
        await Meland1155WearableI.setCIDRarity(cid, asciiToHex(rarity));
    }
};