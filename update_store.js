/* eslint-disable no-undef */
// 上架商品
const fs = require('fs');
const path = require('path');
const csvtojson = require('csvtojson');
const { exit } = require('process');
const { keccak256 } = require("web3-utils");
const MELD = artifacts.require("MELD");
const VipLand = artifacts.require("VipLand");
const TicketLand = artifacts.require("TicketLand");
const NFTStore = artifacts.require("NFTStore");
const Marketplace = artifacts.require("Marketplace");
const NFTFactory = artifacts.require("NFTFactory");
const NFTWithCidMigration = artifacts.require("NFTWithCidMigration");
const NFTWithRarity = artifacts.require("NFTWithRarity");
const cidCSVPath = path.join(__dirname, 'PlaceableNFT.csv');

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

        const MELDInstance = await MELD.deployed();

        const result = await MELDInstance.isPool("0x5832425f794e767e3f890694de5e0fae33bb1bc1");
        const result2 = await MELDInstance.liquidityAddedBlock();

        console.debug(result.toString(), result2.toString());
        
        return;

        const existsNFTStore = await NFTStore.deployed();
        const ticketLandInstance = await TicketLand.deployed();
        // const instanceOfNFTWithCidMigration = await NFTWithCidMigration.deployed();

        console.debug("开始上架ticket land");
        const ticketLandInStore = await existsNFTStore.itemByNFT(ticketLandInstance.address);
        if (ticketLandInStore.id == 0) {
            // 设置商店托管权限
            await ticketLandInstance.grantRole(keccak256("MINTER_ROLE"), existsNFTStore.address);
            const {
                ticketLandPriceInWei,
                ticketLandLimit
            } = process.env;
            const tokenIdPool = true;
            console.debug("create NFT to NFTStore with", ticketLandPriceInWei, ticketLandLimit, tokenIdPool);
            const result = await existsNFTStore.createNFT(
                ticketLandInstance.address,
                ticketLandPriceInWei,
                ticketLandLimit,
                tokenIdPool,
                "这是description"
            );
            console.log('上架成功ticket land', result);
        }

        await existsNFTStore.updateTokenIdPool(
            ticketLandInstance.address,
            [
                100001,
                200001,
                300001,
                400001
            ]
        );

        console.debug("开始上架NFT");
        const cidBuffer = fs.readFileSync(cidCSVPath);
        const cidList = (await csvtojson({}).fromString(cidBuffer.toString())).slice(2, -1);
        for (let i = 0; i < cidList.length; i++) {
            let cidItem = cidList[i];
            const cid = cidItem['关联物品id'];
            const tokenName = cidItem['token名'];
            const tokenS = cidItem['token符号'];
            const description = cidItem['描述'];
            const rarity = cidItem['稀有度'];
            await promiseTimeout();
            const instance = await NFTWithRarity.new();
            await instance.initialize(
                tokenName,
                tokenS,
                rarity,
                cid
            );
            await instance.setBaseURI(`https://token-metadata-${env}.melandworld.com/placeable/`);
            await instance.grantRole(keccak256("MINTER_ROLE"), existsNFTStore.address);
            const {
                ticketLandPriceInWei,
                nftLimit = 0,
                nftTokenIdPool = false
            } = process.env;
            console.debug("create NFT to NFTStore with", ticketLandPriceInWei, nftLimit, nftTokenIdPool);
            const result = await existsNFTStore.createNFT(
                instance.address,
                ticketLandPriceInWei,
                0,
                nftTokenIdPool,
                description
            );
            console.info("上架NFT完成 cid:", cid, result);
        }
        console.debug(cidList);
        callback();
        exit(0);
    } catch (error) {
        console.error(error);
        callback();
    }
};