/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { BigNumber } = require('ethers');
const { asciiToHex } = require("web3-utils");
const Meland1155Wearable = artifacts.require("Meland1155Wearable");
const Meland1155Land = artifacts.require("Meland1155Land");
const MelandTier = artifacts.require("MelandTier");
const MELD = artifacts.require("MELD");

module.exports = async function (deployer, network, accounts) {
    if (![
        "matic",
        "mumbai",
        "develop",
        "test"
    ].includes(network)) {
        console.log("Deploy only on polygon networks");
        return;
    }

    const env = 'release';
    const MELDI = await MELD.deployed();
    const Meland1155WearableI = await Meland1155Wearable.deployed();
    const Meland1155LandI = await Meland1155Land.deployed();
    const MelandTierI = await MelandTier.deployed();

    await Meland1155LandI.setMelandTier(MelandTierI.address);

    const ids = [
        100001,
        100002,
        100003,
        100004,
        100005,
        100006,
        100007,
        100008,
        100009,
        1000010,
        1000011,
        1000012
    ];
    for (let i = 0; i < ids.length; i ++) {
        await Meland1155LandI.mint(accounts[0], `${ids[i]}22`, 1, asciiToHex("ticketland"));
        await MelandTierI.add100PercentReward(89000002, [
            {
                erc1155: Meland1155LandI.address,
                tokenIds: [`${ids[i]}22`],
                amounts: [1],
            }
        ], [], []);
    }

    await MelandTierI.startSale(89000002);

    await MelandTierI.mint(
        "0xA50057d81c828dadF4a314209F65B7aE6EF46461",
        89000002,
        ids.length,
        asciiToHex('')
    );

    await MELDI.mint(BigNumber.from("200000000").mul(BigNumber.from("10").pow(18)));
};