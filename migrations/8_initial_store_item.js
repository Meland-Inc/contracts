/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const NFTStore = artifacts.require("NFTStore");
const Meland1155Wearable = artifacts.require("Meland1155Wearable");
const Meland1155Land = artifacts.require("Meland1155Land");
const Meland1155LandFuture = artifacts.require("Meland1155LandFuture");
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

    const Meland1155LandI = await Meland1155Land.deployed();
    const Meland1155LandFutureI = await Meland1155LandFuture.deployed();
    const NFTStoreI = await NFTStore.deployed();
    const Meland1155WearableI = await Meland1155Wearable.deployed();
    
    await Meland1155WearableI.setStore(NFTStoreI.address);
    await Meland1155LandI.setStore(NFTStoreI.address);
    await Meland1155LandFutureI.setStore(NFTStoreI.address);
};