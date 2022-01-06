/* eslint-disable no-undef */
const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const { getEnvBuyNetwork } = require('../utils');
const keccak256 = require('keccak256')

const MelandExchange = artifacts.require("MelandExchange");
const Meland1155MELDFuture = artifacts.require("Meland1155MELDFuture");
const MELD = artifacts.require("MELD");

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

    const GMROLE = keccak256('GM_ROLE');
    const PAYMENT_ROLE = keccak256('PAYMENT_ROLE');

    const MelandExchangeI = await MelandExchange.deployed();
    const Meland1155MELDFutureI = await Meland1155MELDFuture.deployed();

    MelandExchangeI.grantRole(PAYMENT_ROLE, "0xf521F6d48703DE80Ba378cFf4Ea7519272d315B7");
};