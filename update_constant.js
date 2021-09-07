/* eslint-disable no-undef */
// 自动更新constanst.ts
const fs = require('fs');
const path = require('path');

const MELD = artifacts.require("MELD");
const Question = artifacts.require("Question");
const Land = artifacts.require("Land");
const Marketplace = artifacts.require("Marketplace");


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
    const existsQuestion = await Question.deployed();
    const existsLand = await Land.deployed();
    const existsMarketplace = await Marketplace.deployed();

    if (!existsMELD
        || !existsQuestion
        || !existsLand
        || !existsMarketplace
    ) {
        throw new Error("请先部署");
    }

    const fd = await promiseOpen(configPath);

    const code = `// 不要改动这个文件.
// 通过 turffle deploy 的时候生成.
    
// MELD token address
export const MELDAddress = '${existsMELD.address}';
    
export const QuestionAddress = '${existsQuestion.address}';

export const LandAddress = '${existsLand.address}';

export const MarketplaceAddress = '${existsMarketplace.address}';
`;

    fs.write(fd, Buffer.from(code), (error) => {
        if (error) {
            throw error;
        }

        console.debug("updated");
    });
};