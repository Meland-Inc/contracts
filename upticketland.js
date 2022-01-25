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
        // await Meland1155LandI.claerticketlandIds();
        // await Meland1155LandI.setStoreItem('ticketland', BigNumber.from(160).mul(BigNumber.from(10).pow(18)));
        // await Meland1155LandI.addticketlandIds([
        //     7420500,
        //     7730444,
        //     8060527,
        //     7800450,
        //     6510602,
        //     7790373,
        //     7920528,
        //     8040547,
        //     7530450,
        //     7620483,
        //     7790551,
        //     7760562,
        //     7530543,
        //     6370613,
        //     6750589,
        //     7610512,
        //     7440426,
        //     6690610,
        //     7920396,
        //     7560574,
        //     7970541,
        //     7980599,
        //     8110445,
        //     7470469,
        //     7610369,
        //     6650573,
        //     7790414,
        //     7560494,
        //     6530575,
        //     7760361,
        //     8160397,
        //     7670464,
        //     8060475,
        //     6750615,
        //     7550414,
        //     8110386,
        //     8000476,
        //     7730408,
        //     7490494,
        //     6450605,
        //     7820540,
        //     7990515,
        //     7440549,
        //     8050386,
        //     7990420,
        //     7810438,
        //     7720402,
        //     7870414,
        //     7690366,
        //     8050469,
        //     7680432,
        //     6780571,
        //     8090490,
        //     7820546,
        //     7580426,
        //     7660450,
        //     7850521,
        //     7640402,
        //     7970547,
        //     7480512,
        //     8030578,
        //     7480388,
        //     7480382,
        //     6510621,
        //     7530438,
        //     7850484,
        //     7490500,
        //     6430611,
        //     7700521,
        //     7860559,
        //     7730544,
        //     7920521,
        //     7920491,
        //     7810426,
        //     8130432,
        //     7730372,
        //     7920534,
        //     7630576,
        //     7870587,
        //     7790533,
        //     8040541,
        //     7410469,
        //     7790515,
        //     7880456,
        //     7880390,
        //     8020444,
        //     7750497,
        //     7800444,
        //     8010594,
        //     7660571,
        //     7450393,
        //     7870450,
        //     7510426,
        //     7480475,
        //     7740456,
        //     7540525,
        //     8010508,
        //     8150415,
        //     7540512,
        //     7930502,
        //     7770590,
        //     7440555,
        //     7590420,
        //     8120439,
        //     7890462,
        //     7680386,
        //     7860408,
        //     7680506,
        //     7450432,
        //     7830362,
        //     7410566,
        //     7490487,
        //     7660444,
        //     7740478,
        //     7990408,
        //     8060396,
        //     7600518,
        //     6530591,
        //     7470531,
        //     7530531,
        //     7610444,
        //     7610477,
        //     7880444,
        //     7420506,
        //     8100574,
        //     7940450,
        //     7560408,
        //     7550366,
        //     7660539,
        //     7600463,
        //     8110541,
        //     8140426,
        //     8070457,
        //     7930496,
        //     7910484,
        //     7680478,
        //     7740390,
        //     7540481,
        //     7800490,
        //     7800408,
        //     7480414,
        //     7690527,
        //     7730573,
        //     7850396,
        //     8100509,
        //     8030438,
        //     7390456,
        //     7650548,
        //     7410481,
        //     7600438,
        //     7790386,
        //     8170409,
        //     8060373,
        //     7430379,
        //     7800509,
        //     7620414,
        //     6640567,
        //     7440561,
        //     7770578,
        //     6750577,
        //     7830476,
        //     7860502,
        //     7930375,
        //     7920515,
        //     6660616,
        //     8060432,
        //     7790521,
        //     7470462,
        //     7820470,
        //     7720414,
        //     7730420,
        //     7850533,
        //     7760568,
        //     7930509,
        //     8060367,
        //     7850496,
        //     7400444,
        //     7550506,
        //     7670500,
        //     8110451,
        //     7540444,
        //     6570603,
        //     7520456,
        //     8130503,
        //     7830576,
        //     7480568,
        //     7690484,
        //     7810456,
        //     7540469,
        //     7540518,
        //     8100580,
        //     7550475,
        //     7730509,
        //     8010483,
        //     7480481,
        //     7630521,
        //     7470420,
        //     8140463,
        //     8100547,
        //     7660373,
        //     7860402,
        //     8110408,
        //     7470543,
        //     7830570,
        //     7980521,
        //     8030572,
        //     7510563,
        //     7950462,
        //     7980534,
        //     7860553,
        //     7920432,
        //     7790527,
        //     7940592,
        //     8130515,
        //     7500555,
        //     7860374,
        //     7700360,
        //     7990502,
        //     7530463,
        //     8070502,
        //     7870384,
        //     7480506,
        //     7730515,
        //     7550500,
        //     7950482,
        //     7790402,
        //     7790557,
        //     7570561,
        //     7830564,
        //     7950444,
        //     7930553,
        //     7860509,
        //     7860490,
        //     7670438,
        //     8000391,
        //     7650426,
        //     7540420,
        //     7720557,
        //     8000414,
        //     7490408,
        //     7410475,
        //     8060521,
        //     7990528,
        //     8060408,
        //     8070414,
        //     7860515,
        //     8060379,
        //     7620362,
        //     7890540,
        //     7470444,
        //     7760503,
        //     6790583,
        //     8060533,
        //     7610432,
        //     7610469,
        //     8000426,
        //     7600450,
        //     7610506,
        //     7950456,
        //     7650392,
        //     6810611,
        //     7960564,
        //     7710536,
        //     7960570,
        //     6510608,
        //     7750484,
        //     7740438,
        //     7500402,
        //     8130527,
        //     7630527,
        //     7690379,
        //     7590536,
        //     7930402,
        //     8140457,
        //     7670512,
        //     6440598,
        //     7870426,
        //     7750470,
        //     7840592,
        //     7860527,
        //     7510549,
        //     6470580,
        //     7550488,
        //     6650599,
        //     7960438,
        //     7400462,
        //     8080483,
        //     8030566,
        //     8080463,
        //     7780396,
        //     7930408,
        //     7760476,
        //     7640555,
        //     7910597,
        //     7670456,
        //     7720551,
        //     7740464,
        //     8020497,
        //     7930426,            
        // ]);
        // console.debug(await Meland1155LandI.melandStoreSellStatus(asciiToHex("ticketland")));
        // console.debug(await Meland1155LandI.ticketlandIds(0));
        // await NFTStoreI.updateNFTItemInfo(Meland1155LandI.address);

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