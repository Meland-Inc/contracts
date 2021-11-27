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
const NFTFactory = artifacts.require("NFTFactory");


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
        const factory = await NFTFactory.deployed();

        const addSupports = async (nft) => {
            const bool = await factory.supportNFTs(nft);
            if (!bool) {
                return factory.newSupport(nft);
            }
            return;
        }

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

        await addSupports(ticketLandInstance.address);

        const ids = [
            6300454,
            6440445,
            6370442,
            6460447,
            6430436,
            6390435,
            6320432,
            6430449,
            6370446,
            6470454,
            5900465,
            5880461,
            5970463,
            5950472,
            5910470,
            5970467,
            6030487,
            6210482,
            6080489,
            6030501,
            6000482,
            6190492,
            6220503,
            6010490,
            6000485,
            6070503,
            6130490,
            6180476,
            6190459,
            6160456,
            6010463,
            6040464,
            6170471,
            6060456,
            6120456,
            6220462,
            6210479,
            6020467,
            6040460,
            6210467,
            6670542,
            6570534,
            6660534,
            6690534,
            6600531,
            6560549,
            6600548,
            6660530,
            6690539,
            6710529,
            6600535,
            6600542,
            6590538,
            6630542,
            6690551,
            6640539,
            6680546,
            6650551,
            6580544,
            6630535,
            6630530,
            6640547,
            6560531,
            5890485,
            5920487,
            5930482,
            5930490,
            5970481,
            5880481,
            5890493,
            5920493,
            5970488,
            5890489,
            5960492,
            5960485,
            6780450,
            6750454,
            6830447,
            6800447,
            6780435,
            6830439,
            6780453,
            6740447,
            6840453,
            6780445,
            6730454,
            6750450,
            6820443,
            6750435,
            6820436,
            6810454,
            6820450,
            6740432,
            6800472,
            6840476,
            6750460,
            6790461,
            6760457,
            6760471,
            6760463,
            6750476,
            6820466,
            6840468,
            6830460,
            6790468,
            6720473,
            6720469,
            6750467,
            6780477,
            6790465,
            6810475,
            6830457,
            6730478,
            6840464,
            6820471,
            6800458,
            6810462,
            6440512,
            6250527,
            6280513,
            6320514,
            6390515,
            6300517,
            6270526,
            6270515,
            6240514,
            6390510,
            6390505,
            6270510,
            6350517,
            6310510,
            6360506,
            5990445,
            5970443,
            5990432,
            5970433,
            5990451,
            5970448,
            6320535,
            6300545,
            6320540,
            6370533,
            6340543,
            6350538,
            6380540,
            6280533,
            6260546,
            6280539,
            6400536,
            6330549,
            6560457,
            6500468,
            6650476,
            6640458,
            6710476,
            6600465,
            6680478,
            6630464,
            6550460,
            6620460,
            6580468,
            6490471,
            6570465,
            6580462,
            6590459,
            6490456,
            6700470,
            6670466,
            6520457,
            6530471,
            6520475,
            6550474,
            6640471,
            6680458,
            6710456,
            6670469,
            6650462,
            6610469,
            6560471,
            6570476,
            6640467,
            6680474,
            6720533,
            6800546,
            6770547,
            6740551,
            6810540,
            6800551,
            6720537,
            6830533,
            6830537,
            6760528,
            6730548,
            6730544,
            6770531,
            6780535,
            6820545,
            6750538,
            6740532,
            6810531,
            6290490,
            6440498,
            6310487,
            6420493,
            6360490,
            6290497,
            6460500,
            6340484,
            6450484,
            6300484,
            6240481,
            6440489,
            6310500,
            6470496,
            6400490,
            6420486,
            6280500,
            6340487,
            6360481,
            6260494,
            6250499,
            6380486,
            6270503,
            6270482,
            6360502,
            6110430,
            6260479,
            6290471,
            6290467,
            6240477,
            6470468,
            6290457,
            6390457,
            6380467,
            6250461,
            6360456,
            6360470,
            6260464,
            6260473,
            6320473,
            6350478,
            6290463,
            6430463,
            6350459,
            6440466,
            6360475,
            6320462,
            6450460,
            6320458,
            6320469,
            6380473,
            6400476,
            6470459,
            6470474,
            6360465,
            6460456,
            6470464,
            6430474,
            6320465,
            6340468,
            6810512,
            6770520,
            6730527,
            6830517,
            6790509,
            6760516,
            6830523,
            6760508,
            6830507,
            6720510,
            6800515,
            6760523,
            6750504,
            6720524,
            6720520,
            6790526,
            6840513,
            6800505,
            6820526,
            6730517,
            6800522,
            6820431,
            6760430,
            6610485,
            6690482,
            6650485,
            6580499,
            6650482,
            6580480,
            6580492,
            6610500,
            6520499,
            6670487,
            6490486,
            6670490,
            6640488,
            6530488,
            6590489,
            6600482,
            6680494,
            6630490,
            6570503,
            6640493,
            6490499,
            6700486,
            6570486,
            6560490,
            6600495,
            6700490,
            6090566,
            6050567,
            6140558,
            6200555,
            6170561,
            6230559,
            6220566,
            6110555,
            6200563,
            6150554,
            6070552,
            6100561,
            6170565,
            6050563,
            6070557,
            6260566,
            6410560,
            6330558,
            6440557,
            6250562,
            6460564,
            6300560,
            6330567,
            6430563,
            6330553,
            6240552,
            6290564,
            6300555,
            6270557,
            6280552,
            6350564,
            6390565,
            6530504,
            6700505,
            6650508,
            6620504,
            6710514,
            6680509,
            6490512,
            6520509,
            6550507,
            6670505,
            6620508,
            6580507,
            6580558,
            6530554,
            6580561,
            6660556,
            6630566,
            6480559,
            6710566,
            6550552,
            6670564,
            6540563,
            6590565,
            6530557,
            6710554,
            6550566,
            6510563,
            6630560,
            6510566,
            6590554,
            6610557,
            6750492,
            6770503,
            6780491,
            6810488,
            6830502,
            6720480,
            6730487,
            6730495,
            6780483,
            6800480,
            6830486,
            6780499,
            6730499,
            6730490,
            6840491,
            6810501,
            6760480,
            6760489,
            6760495,
            6840497,
            6770486,
            6730484,
            6800493,
            6030451,
            6080453,
            6000442,
            6060450,
            6110452,
            6230446,
            6020443,
            6090450,
            6100455,
            6130451,
            6020435,
            6010448,
            6490452,
            6530442,
            6530439,
            6590445,
            6530432,
            6630445,
            6710452,
            6530453,
            6590455,
            6660455,
            6560454,
            6520445,
            6570448,
            6560440,
            6570442,
            6690449,
            6630432,
            6680453,
            6630452,
            6620455,
            6660451,
            6490433,
            6690432,
            6590440,
            6500453,
            6580452,
            6480444,
            6480436,
            6480446,
            6510436,
            6550443,
            6510430,
            6560431,
            6610430,
            6660430,
            6710430,
            6480430,
            6140524,
            6120521,
            6180521,
            6220519,
            6180527,
            6220515,
            6190524,
            6100524,
            6780556,
            6770553,
            6830565,
            6820557,
            6730563,
            6820554,
            6760559,
            6730558,
            6770564,
            6380431,
            6350430,
            6450430,
            6150533,
            6050539,
            6190535,
            6150528,
            6090531,
            6060534,
            6070544,
            6110529,
            6170549,
            6150537,
            6230537,
            6210542,
            6080539,
            6180530,
            6210528,
            6230532,
            6200532,
            6140541,
            6210546,
            6190539,
            6140547,
            6200550,
            6170544,
            6030531
        ];

        // let aj = 0;
        // var i, j, temporary, chunk = 10;
        // for (i = 0, j = ids.length; i < j; i += chunk) {
        //     temporary = ids.slice(i, i + chunk);

        //     console.debug("开始上架ticket land ids", temporary.length, '已经上传:', aj);

        //     await existsNFTStore.addTokenIdPool(
        //         ticketLandInstance.address,
        //         temporary
        //     );

        //     aj += temporary.length;
        // }

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
                await addSupports(nftAddress);
                console.debug("nft 已经存在跳过上架", cid);
                continue;
            }
            await promiseTimeout();
            const instance = await NFTWithRarity.new();
            await addSupports(instance.address);
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