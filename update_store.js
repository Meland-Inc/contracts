/* eslint-disable no-undef */
// 上架商品
const fs = require('fs');
const path = require('path');
const csvtojson = require('csvtojson');
const { exit } = require('process');
const { keccak256 } = require("web3-utils");
const TicketLand = artifacts.require("TicketLand");
const NFTStore = artifacts.require("NFTStore");
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

        const existsNFTStore = await NFTStore.deployed();
        const ticketLandInstance = await TicketLand.deployed();

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
                "this is ticket land"
            );
            console.log('上架成功ticket land', result);
        }

       
        // await existsNFTStore.updateTokenIdPool(
        //     ticketLandInstance.address,
        //     [
        //         5950430,
        //         5990430,
        //         6290433,
        //         6420432,
        //         6370438,
        //         6440454,
        //         6360434,
        //         6460451,
        //         6240435,
        //         6370450,
        //         6460433,
        //         6310444,
        //     ]
        // );

        console.debug("开始上架NFT");
        const cidBuffer = fs.readFileSync(cidCSVPath);
        const cidList = (await csvtojson({}).fromString(cidBuffer.toString())).slice(2);
        for (let i = 0; i < cidList.length; i++) {
            let cidItem = cidList[i];
            const cid = cidItem['关联物品id'];
            const tokenName = cidItem['token名'];
            const tokenS = cidItem['token符号'];
            const description = cidItem['描述'];
            const rarity = cidItem['稀有度'];
            const priceInWei = cidItem['销售价格（不要改）'];
            console.debug(cid);
            const nftAddress = await existsNFTStore.nftByCid(cid);
            console.debug(nftAddress, 'xxxx');
            if (nftAddress
                && nftAddress !== "0x0000000000000000000000000000000000000000"
            ) {
                console.debug("nft 已经存在跳过上架", cid);
                continue;
            }
            await promiseTimeout();
            const instance = await NFTWithRarity.new();
            await instance.initialize(
                tokenName,
                tokenS,
                rarity,
                cid
            );
            await instance.setBaseURI(`https://token-metadata-release.melandworld.com/placeable/`);
            await instance.grantRole(keccak256("MINTER_ROLE"), existsNFTStore.address);
            const {
                nftLimit = 0,
                nftTokenIdPool = false
            } = process.env;
            console.debug("create NFT to NFTStore with", priceInWei, nftLimit, nftTokenIdPool);
            const result = await existsNFTStore.createNFT(
                instance.address,
                priceInWei,
                nftLimit,
                nftTokenIdPool,
                description
            );
            console.info("上架NFT完成 cid:", cid, result);
        }
        callback();
        exit(0);
    } catch (error) {
        console.error(error);
        callback();
    }
};