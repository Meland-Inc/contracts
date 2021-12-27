/* eslint-disable no-undef */
// 上架商品
const fs = require('fs');
const path = require('path');
const csvtojson = require('csvtojson');
const { keccak256 } = require("web3-utils");
const { BigNumber } = require('ethers');
const { asciiToHex, encodePacked } = require("web3-utils");
const NFTStore = artifacts.require("NFTStore");

const Meland1155Wearable = artifacts.require("Meland1155Wearable");
const Meland1155Land = artifacts.require("Meland1155Land");
const Meland1155LandFuture = artifacts.require("Meland1155LandFuture");


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

        const NFTStoreI = await NFTStore.deployed();
        const Meland1155LandI = await Meland1155Land.deployed();
        const Meland1155LandFutureI = await Meland1155LandFuture.deployed();
        const Meland1155WearableI = await Meland1155Wearable.deployed();


        const vcsBuffer = fs.readFileSync(path.join((__dirname), "WearableNFT.csv"));
        let wearableNFTs = (await csvtojson({}).fromString(vcsBuffer.toString())).slice(2);

        for (let i = 0; i < wearableNFTs.length; i++) {
            const w = wearableNFTs[i];
            const cid = w['关联物品id'];
            const name = w['物品名称'];
            const price = w['销售价格（不要改）'];
            console.debug(cid, price, name, 0);
            // await Meland1155WearableI.setStoreItem(cid, price);
        }

        console.debug(await Meland1155LandFutureI.canBuyListByAddress("0x714df076992f95E452A345cD8289882CEc6ab82F"));

        // await Meland1155LandI.delStoreItem(asciiToHex("ticketland"));
        // await Meland1155LandFutureI.delStoreItem(asciiToHex("vipland1x1"));
        // await Meland1155LandFutureI.delStoreItem(asciiToHex("vipland2x2"));
        // await Meland1155LandFutureI.delStoreItem(asciiToHex("vipland4x4"));

        // await Meland1155LandI.setStoreItem(("ticketland"), BigNumber.from(2000).mul(BigNumber.from(10).pow(18)));
        // await Meland1155LandFutureI.setStoreItem(("vipland1x1"), BigNumber.from(25).mul(BigNumber.from(10).pow(16)));
        // await Meland1155LandFutureI.setStoreItem(("vipland2x2"), BigNumber.from(88).mul(BigNumber.from(10).pow(16)));
        // await Meland1155LandFutureI.setStoreItem(("vipland4x4"), BigNumber.from(304).mul(BigNumber.from(10).pow(16)));

        // await Meland1155LandFutureI.setCanBuyListByAddress("0xA50057d81c828dadF4a314209F65B7aE6EF46461", true);

        callback();
    } catch (error) {
        console.error(error);
        callback();
    }
};