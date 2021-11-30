/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const VestPool = artifacts.require("VestPool");
const MELD = artifacts.require("MELD");
const keccak256 = require('keccak256')

module.exports = async function (deployer, network) {
    // vest 只部署于bsc
    if (![
        "develop",
        "bsc",
        "bsctest",
        "test"
    ].includes(network)) {
        console.log("Deploy only on bsc networks");
        return;
    }

    const existsMELD = await MELD.deployed();
    const vestPoolInstance = await deployProxy(VestPool, [existsMELD.address], { deployer, kind: 'uups' });

    const GMROLE = keccak256('GM_ROLE');

    await vestPoolInstance.grantRole(GMROLE, process.env.gm);
};