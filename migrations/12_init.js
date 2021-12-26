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
    await NFTStoreI.createNFT(Meland1155WearableI.address);
};