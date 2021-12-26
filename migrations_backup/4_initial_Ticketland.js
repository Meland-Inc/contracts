/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const NFTStore = artifacts.require("NFTStore");
const TicketLand = artifacts.require("TicketLand");

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
    const env = 'release';
    const ticketLandInstance = await deployProxy(TicketLand, [], { deployer, kind: 'uups' });
    // 设置baseURI
    await ticketLandInstance.setBaseURI(`https://token-metadata-${env}.melandworld.com/ticketland/`);
};