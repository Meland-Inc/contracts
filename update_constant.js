/* eslint-disable no-undef */
// 自动更新constanst.ts
const fs = require('fs');
const path = require('path');
const { exit } = require('process');

const MELD = artifacts.require("MELD");
const Land = artifacts.require("Meland1155Land");
const NFTStore = artifacts.require("NFTStore");
const Marketplace = artifacts.require("Marketplace");
const NFTFactory = artifacts.require("NFTFactory");
const Faucet = artifacts.require("Faucet");
const Meland1155Wearable = artifacts.require("Meland1155Wearable");
const Meland1155Placeable = artifacts.require("Meland1155Placeable");
const MelandTier = artifacts.require("MelandTier");
const Meland1155LandFuture = artifacts.require("Meland1155LandFuture");
const Meland1155MELDFuture = artifacts.require("Meland1155MELDFuture");
const MelandExchange = artifacts.require("MelandExchange");

const promiseOpen = (filePath, mode = 'w') => {
    return new Promise((resolve, reject) => {
        fs.open(filePath, mode, (error, fd) => {
            if (error) {
                return reject(error);
            }
            return resolve(fd);
        });
    })
};

const networkFilenameMap = {
    'develop': 'local.json',
    'mumbai': 'mumbai.json',
    'matic': 'matic.json'
};

const networkStartBlockMap = {
    'develop': "0",
    'mumbai': "23574402",
    'matic': "23029177",
}

module.exports = async function (_) {
    let network = config.network;
    const configPath = path.join(process.env.indexerConfigDir || process.cwd(), `${networkFilenameMap[network]}`);

    let MELDAddress = '0x48844ddba89799dc40ec31728dac629802d407f3';

    if (network == "mumbai") {
        const existsMELD = await MELD.deployed();
        MELDAddress = existsMELD.address;
    }

    // const existsVipLand = await VipLand.deployed();
    const LandI = await Land.deployed();
    const existsNFTStore = await NFTStore.deployed();
    const existsMarketplace = await Marketplace.deployed();
    const existsNFTFactory = await NFTFactory.deployed();
    const Meland1155WearableI = await Meland1155Wearable.deployed();
    const Meland1155PlaceableI = await Meland1155Placeable.deployed();
    const MelandTierI = await MelandTier.deployed();
    const Meland1155LandFutureI = await Meland1155LandFuture.deployed();
    const Meland1155MELDFutureI = await Meland1155MELDFuture.deployed();
    const MelandExchangeI = await MelandExchange.deployed();

    let faucetAddress = '';
    if ([
        // "mumbai",
        // "develop",
        "test"
    ].includes(network)) {
        const existsFaucet = await Faucet.deployed();
        faucetAddress = existsFaucet.address;
    }

    let vestPoolAddress = '';
    if ([
        "bsc",
        "bsctest",
        // "develop",
        "test"
    ].includes(network)) {
        const existsVestPool = await VestPool.deployed();
        vestPoolAddress = existsVestPool.address;
    }

    const fd = await promiseOpen(configPath);

    /// 本地开发模拟mumbai链
    const code = `{
    "network": "${network == "local" ? "mumbai" : network}",
    "Land_address": "${LandI.address}",
    "NFTStore_address": "${existsNFTStore.address}",
    "Marketplace_address": "${existsMarketplace.address}",
    "MELD_address": "${MELDAddress}",
    "NFTFactory_address": "${existsNFTFactory.address}",
    "Faucet_address": "${faucetAddress}",
    "VestPool_address": "${vestPoolAddress}",
    "Meland1155Wearable_address": "${Meland1155WearableI.address}",
    "Meland1155Placeable_address": "${Meland1155PlaceableI.address}",
    "Meland1155LandFuture_address": "${Meland1155LandFutureI.address}",
    "Meland1155MELDFuture_address": "${Meland1155MELDFutureI.address}",
    "MelandExchange_address": "${MelandExchangeI.address}",
    "MelandTier_address": "${MelandTierI.address}",
    "start_block": "${networkStartBlockMap[network]}"
}
`;

    await new Promise((resolve) => {
        fs.write(fd, Buffer.from(code), (error) => {
            if (error) {
                throw error;
            }

            resolve();
        });
    });

    console.info("save to", configPath);
    exit(0);
};