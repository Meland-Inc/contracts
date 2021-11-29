/* eslint-disable no-undef */
// 自动更新constanst.ts
const fs = require('fs');
const path = require('path');
const { exit } = require('process');

const MELD = artifacts.require("MELD");
const TicketLand = artifacts.require("TicketLand");
const NFTStore = artifacts.require("NFTStore");
const Marketplace = artifacts.require("Marketplace");
const NFTFactory = artifacts.require("NFTFactory");
const Faucet = artifacts.require("Faucet");
const VestPool = artifacts.require("VestPool");

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
    'mumbai': 'mumbai.json'
};

module.exports = async function (_) {
    let network = config.network;
    const configPath = path.join(process.env.indexerConfigDir || process.cwd(), `${networkFilenameMap[network]}`);

    const existsMELD = await MELD.deployed();
    // const existsVipLand = await VipLand.deployed();
    const existsTicketLand = await TicketLand.deployed();
    const existsNFTStore = await NFTStore.deployed();
    const existsMarketplace = await Marketplace.deployed();
    const existsNFTFactory = await NFTFactory.deployed();

    let faucetAddress = '';
    if ([
        "mumbai",
        "develop",
        "test"
    ].includes(network)) {
        const existsFaucet = await Faucet.deployed();
        faucetAddress = existsFaucet.address;
    }

    let vestPoolAddress = '';
    if ([
        "bsc",
        "bsctest",
        "develop",
        "test"
    ].includes(network)) {
        const existsVestPool = await VestPool.deployed();
        vestPoolAddress = existsVestPool.address;
    }

    const fd = await promiseOpen(configPath);

    /// 本地开发模拟mumbai链
    const code = `{
    "network": "${network == "local" ? "mumbai" : network}",
    "VipLand_address": "${existsTicketLand.address}",
    "TicketLand_address": "${existsTicketLand.address}",
    "NFTStore_address": "${existsNFTStore.address}",
    "Marketplace_address": "${existsMarketplace.address}",
    "MELD_address": "${existsMELD.address}",
    "NFTFactory_address": "${existsNFTFactory.address}",
    "Faucet_address": "${faucetAddress}",
    "VestPool_address": "${vestPoolAddress}",
    "start_block": "21743671"
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