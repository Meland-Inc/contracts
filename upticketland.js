/* eslint-disable no-undef */
// 上架商品
const fs = require('fs');
const path = require('path');
const csvtojson = require('csvtojson');
const { keccak256 } = require("web3-utils");
const { BigNumber } = require('ethers');
const { asciiToHex, encodePacked } = require("web3-utils");
const NFTStore = artifacts.require("NFTStore");

const Meland1155LandFuture = artifacts.require("Meland1155LandFuture");
const Meland1155Land = artifacts.require("Meland1155Land");

const promiseTimeout = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

module.exports = async function (callback) {
    try {
        let network = config.network;
        if (![
            "matic",
            "mumbai",
            "develop",
            "rinkeby",
            "test"
        ].includes(network)) {
            console.log("Deploy only on polygon networks");
            callback()
            exit(0);
        }

        const Meland1155LandFutureI = await Meland1155LandFuture.deployed();
        const NFTStoreI = await NFTStore.deployed();
        const Meland1155LandI = await Meland1155Land.deployed();
        await Meland1155LandI.claerticketlandIds();
        await Meland1155LandI.addticketlandIds([
            100002,
            100003,
            100004,
        ]);
        // console.debug(await Meland1155LandI.melandStoreSellStatus(asciiToHex("ticketland")));
        // console.debug(await Meland1155LandI.ticketlandIds(0));
        await NFTStoreI.updateNFTItemInfo(Meland1155LandI.address);

        // await Meland1155LandFutureI.setAcceptedToken("0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1");
        // address account,
        // uint256 amount,
        // bytes memory landtype
        // await NFTStoreI.buyNFT(Meland1155LandFutureI.address, asciiToHex("vipland1x1"), BigNumber.from(25).mul(BigNumber.from(10).pow(16)));

        callback();
    } catch (error) {
        console.error(error);
        callback();
    }
};