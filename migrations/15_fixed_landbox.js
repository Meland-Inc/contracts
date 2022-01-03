/* eslint-disable no-undef */
const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

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

    const Meland1155LandFutureI = await Meland1155LandFuture.deployed();

    await upgradeProxy(Meland1155LandFutureI.address, Meland1155LandFuture, {
        kind: 'uups',
        deployer
    });
};