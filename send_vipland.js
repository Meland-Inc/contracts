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
const MelandTier = artifacts.require("MelandTier");
const Meland1155Placeable = artifacts.require("Meland1155Placeable");

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

        let accounts = await web3.eth.getAccounts();

        const Meland1155LandI = await Meland1155Land.deployed();
        const Meland1155PlaceableI = await Meland1155Placeable.deployed();
        const Meland1155WearableI = await Meland1155Wearable.deployed();
        // const MelandTierI = await MelandTier.deployed();

        const ss = await csvtojson({}).fromFile(path.join('sendvipland.csv'));

        for (let i = 0; i < ss.length; i ++) {
            const s = ss[i];

            const landids = `${s['坐标集合']}`.split("#");
            const address = s['归属'];
            const pcid = s['传送门id'];

            console.debug(address, landids, pcid);
            await Meland1155LandI.mintBatch(address, landids, landids.map(() => 1), asciiToHex('vipland'));
            console.debug("land done");
            await Meland1155PlaceableI.mint(address, pcid, 1);
        }

        callback();
        return;

        // function mint(
        //     address account,
        //     uint256 cid,
        //     uint256 amount,
        //     bytes memory data
        // )

        // await MelandTierI.startSale("89000001");
        // await MelandTierI.startSale("89000002");
        
        // await MelandTierI.mint("0xA50057d81c828dadF4a314209F65B7aE6EF46461", 89000001, 20, asciiToHex(''));
        // await MelandTierI.mint("0xA50057d81c828dadF4a314209F65B7aE6EF46461", 89000002, 20, asciiToHex(''));
        // await MelandTierI.mint("0x714df076992f95E452A345cD8289882CEc6ab82F", 89000001, 20, asciiToHex(''));
        // await MelandTierI.mint("0x714df076992f95E452A345cD8289882CEc6ab82F", 89000002, 20, asciiToHex(''));
        await MelandTierI.mint("0x714df076992f95E452A345cD8289882CEc6ab82F", 89000001, 5, asciiToHex(''));

        callback();
    } catch (error) {
        console.error(error);
        callback();
    }
};