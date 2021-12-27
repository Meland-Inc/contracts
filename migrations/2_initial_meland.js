/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const MELD = artifacts.require("MELD");

module.exports = async function (deployer, network) {
  if (![
    "mumbai",
    "develop",
    "bsc",
    "bsctest",
    "rinkeby",
    "test"
  ].includes(network)) {
    console.log("Deploy only on bsc networks");
    return;
  }
  const MELDInstance = await deployProxy(MELD, [], { deployer, kind: 'uups' });
  console.log('Deployed MELD', MELDInstance.address);
};