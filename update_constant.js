/* eslint-disable no-undef */
// 自动更新constanst.ts
const fs = require('fs');
const path = require('path');
const { exit } = require('process');

const MELD = artifacts.require("MELD");
const MELDSeedSale = artifacts.require("MELDSeedSale");
const MELDPrivateSale = artifacts.require("MELDPrivateSale");
const MELDPublicSale = artifacts.require("MELDPublicSale");
const FoundationPool = artifacts.require("FoundationPool");
const LiquidityPool = artifacts.require("LiquidityPool");
const AdvisorPool = artifacts.require("AdvisorPool");
const FounderTeamPool = artifacts.require("FounderTeamPool");
const MELDVesting = artifacts.require("MELDVesting");


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

const configPath = path.join(process.cwd(), "src", "constant.ts");

module.exports = async function () {
    const existsMELD = await MELD.deployed();
    const existsMELDSeedSale = await MELDSeedSale.deployed();
    const existsMELDPrivateSale = await MELDPrivateSale.deployed();
    const existsMELDPublicSale = await MELDPublicSale.deployed();
    const existsFoundationPool = await FoundationPool.deployed();
    const existsLiquidityPool = await LiquidityPool.deployed();
    const existsAdvisorPool = await AdvisorPool.deployed();
    const existsFounderTeamPool = await FounderTeamPool.deployed();
    const existsMELDVesting = await MELDVesting.deployed();

    if (!existsMELD
        || !existsMELDSeedSale
        || !existsMELDVesting
        || !existsFounderTeamPool
        || !existsMELDPrivateSale
        || !existsMELDPublicSale
        || !existsFoundationPool
        || !existsLiquidityPool
        || !existsAdvisorPool
    ) {
        throw new Error("请先部署");
    }

    const fd = await promiseOpen(configPath);

    const code = `// 不要改动这个文件.
// 通过 turffle deploy 的时候生成.
    
// MELD token address
export const MELD = '${existsMELD.address}';
    
export const MELDSeedSale = '${existsMELDSeedSale.address}';

export const MELDPrivateSale = '${existsMELDPrivateSale.address}';

export const MELDPublicSale = '${existsMELDPublicSale.address}';

export const FoundationPool = '${existsFoundationPool.address}';

export const LiquidityPool = '${existsLiquidityPool.address}';

export const AdvisorPool = '${existsAdvisorPool.address}';

export const FounderTeamPool = '${existsFounderTeamPool.address}';

export const MELDVesting = '${existsMELDVesting.address}';

`;

    await new Promise((resolve) => {
        fs.write(fd, Buffer.from(code), (error) => {
            if (error) {
                throw error;
            }

            resolve();
        });
    });

    console.debug("updated");
    exit(0);
};