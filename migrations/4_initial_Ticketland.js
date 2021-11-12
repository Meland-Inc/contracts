/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { keccak256 } = require("web3-utils");

const MELD = artifacts.require("MELD");
const NFTStore = artifacts.require("NFTStore");
const TicketLand = artifacts.require("TicketLand");

module.exports = async function (deployer, network) {
    if (![
        "matic",
        "mumbaimatic",
        "develop",
        "test"
    ].includes(network)) {
        console.log("Deploy only on polygon networks");
        return;
    }
    const existsNFTStore = await NFTStore.deployed();
    const ticketLandInstance = await deployProxy(TicketLand, [], { deployer, kind: 'uups' });

    // 设置商店托管权限
    await ticketLandInstance.grantRole(keccak256("MINTER_ROLE"), existsNFTStore.address);

    // 设置baseURI
    await ticketLandInstance.setBaseURI("https://tokenmetadata.melandworld.com/ticketland/");

    const {
        ticketLandPriceInWei,
        ticketLandLimit
    } = process.env;
    const tokenIdPool = true;

    console.debug("create NFT to NFTStore with", ticketLandPriceInWei, ticketLandLimit, tokenIdPool);

    await existsNFTStore.createNFT(
        ticketLandInstance.address,
        ticketLandPriceInWei,
        ticketLandLimit,
        tokenIdPool
    );
    console.log('Deployed TicketLand', ticketLandInstance.address);

    //
    const tokenURL = await ticketLandInstance.tokenURI(100001);
    console.log("tokenURL", tokenURL);
};