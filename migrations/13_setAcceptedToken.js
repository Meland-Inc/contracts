/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const MELD = artifacts.require("MELD");
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

    let weth = '0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e';
    if (network == 'matic') {
        weth = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619';
    }

    let MELDAddress = '0x48844ddba89799dc40ec31728dac629802d407f3';
    if (network != 'matic') {
        const existsMELD = await MELD.deployed();
        MELDAddress = existsMELD.address;
    }

    const Meland1155WearableI = await Meland1155Wearable.deployed();
    const Meland1155LandI = await Meland1155Land.deployed();
    const Meland1155LandFutureI = await Meland1155LandFuture.deployed();

    await Meland1155WearableI.setAcceptedToken(MELDAddress);
    await Meland1155LandI.setAcceptedToken(MELDAddress);
    await Meland1155LandFutureI.setAcceptedToken(weth);
};