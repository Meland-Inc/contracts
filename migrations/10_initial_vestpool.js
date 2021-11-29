/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const VestPool = artifacts.require("VestPool");
const keccak256 = require('keccak256')

module.exports = async function (deployer, network) {
    // 主Token合约只发布于BSC.
    if (![
        "develop",
        "bsc",
        "bsctest",
        "test"
    ].includes(network)) {
        console.log("Deploy only on bsc networks");
        return;
    }

    const vestPoolInstance = await deployProxy(VestPool, [], { deployer, kind: 'uups' });

    const GMROLE = keccak256('GM_ROLE');

    await vestPoolInstance.grantRole(GMROLE, process.env.gm);
};