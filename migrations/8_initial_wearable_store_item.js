/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const NFTStore = artifacts.require("NFTStore");
const Meland1155Wearable = artifacts.require("Meland1155Wearable");
const csvtojson = require('csvtojson');
const { BigNumber } = require('ethers');
const fs = require('fs');
const path = require('path');
const { asciiToHex, encodePacked } = require("web3-utils");

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

    const NFTStoreI = await NFTStore.deployed();
    const Meland1155WearableI = await Meland1155Wearable.deployed();
    
    await Meland1155WearableI.setStore(NFTStoreI.address);

    const vcsBuffer = fs.readFileSync(path.join(path.dirname(__dirname), "WearableNFT.csv"));
    let wearableNFTs = (await csvtojson({}).fromString(vcsBuffer.toString())).slice(2);

    for (let i = 0; i < wearableNFTs.length; i++) {
        const w = wearableNFTs[i];
        const cid = w['关联物品id'];
        const name = w['物品名称'];
        const price = w['销售价格（不要改）'];
        console.debug(cid, price, name, 0);
        await Meland1155WearableI.setStoreItem(cid, price);
    }
};