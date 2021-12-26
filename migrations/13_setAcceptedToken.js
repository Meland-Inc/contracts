/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const MELD = artifacts.require("MELD");
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

    const MELDI = await MELD.deployed();
    const Meland1155WearableI = await Meland1155Wearable.deployed();
    
    await Meland1155WearableI.setAcceptedToken(MELDI.address);
};