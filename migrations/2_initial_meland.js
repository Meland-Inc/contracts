/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const MELD = artifacts.require("MELD");

module.exports = async function (deployer) {
  const MELDInstance = await deployProxy(MELD, [], { deployer, kind: 'uups' });
  console.log('Deployed MELD', MELDInstance.address);
};