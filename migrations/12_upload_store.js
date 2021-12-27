/* eslint-disable no-undef */
const NFTStore = artifacts.require("NFTStore");
const Meland1155Wearable = artifacts.require("Meland1155Wearable");
const Meland1155Land = artifacts.require("Meland1155Land");
const Meland1155LandFuture = artifacts.require("Meland1155LandFuture");

module.exports = async function (deployer, network) {
    if (![
        "matic",
        "mumbai",
        "develop",
        "test"
    ].includes(network)) {
        console.log("Deploy only on polygon networks");
        return;
    }
    const NFTStoreI = await NFTStore.deployed();
    const Meland1155LandI = await Meland1155Land.deployed();
    const Meland1155LandFutureI = await Meland1155LandFuture.deployed();
    const Meland1155WearableI = await Meland1155Wearable.deployed();
    await NFTStoreI.createNFT(Meland1155WearableI.address);
    await NFTStoreI.createNFT(Meland1155LandFutureI.address);
    await NFTStoreI.createNFT(Meland1155LandI.address);
};