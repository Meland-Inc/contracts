/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { asciiToHex } = require("web3-utils");
const Meland1155Wearable = artifacts.require("Meland1155Wearable");
const Meland1155Land = artifacts.require("Meland1155Land");
const MelandTier = artifacts.require("MelandTier");

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
    const Meland1155WearableI = await Meland1155Wearable.deployed();
    const Meland1155LandI = await Meland1155Land.deployed();
    const MelandTierI = await MelandTier.deployed();

    // await Meland1155LandI.setMelandTier(MelandTierI.address);

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
    // for (let i = 0; i < ids.length; i ++) {
    //     await Meland1155LandI.mint(accounts[0], ids[i], 1, asciiToHex("ticketland"));
    //     await MelandTierI.add100PercentReward(89000001, [
    //         {
    //             erc1155: Meland1155LandI.address,
    //             tokenIds: [ids[i]],
    //             amounts: [1],
    //         }
    //     ], [], []);
    // }

    // await MelandTierI.startSale(89000001);

    // await MelandTierI.mint(
    //     "0x714df076992f95E452A345cD8289882CEc6ab82F",
    //     89000001,
    //     ids.length,
    //     asciiToHex('')
    // );

    console.debug(await Meland1155WearableI.melandStoreSellStatus("1210003"));
};