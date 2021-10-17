/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const MELD = artifacts.require("MELD");
const MELDSeedSale = artifacts.require("MELDSeedSale");
const MELDPrivateSale = artifacts.require("MELDPrivateSale");
const MELDPublicSale = artifacts.require("MELDPublicSale");
const FoundationPool = artifacts.require("FoundationPool");
const LiquidityPool = artifacts.require("LiquidityPool");
const AdvisorPool = artifacts.require("AdvisorPool");
const FounderTeamPool = artifacts.require("FounderTeamPool");
const MELDVesting = artifacts.require("MELDVesting");

module.exports = async function (deployer) {
  const MELDInstance = await MELD.deployed();
  console.log('Deployed MELD', MELDInstance.address);

  const MELDVestingInstance = await MELDVesting.deployed();
  
  const FoundationPoolInstance = await deployProxy(FoundationPool, [
    MELDInstance.address, 
    MELDVestingInstance.address
  ], { deployer, kind: 'uups' });
  console.log('Deployed FoundationPool', FoundationPoolInstance.address);

  const LiquidityPoolInstance = await deployProxy(LiquidityPool, [
    MELDInstance.address, 
    MELDVestingInstance.address
  ], { deployer, kind: 'uups' });
  console.log('Deployed LiquidityPool', LiquidityPoolInstance.address);

  const AdvisorPoolInstance = await deployProxy(AdvisorPool, [
    MELDInstance.address, 
    MELDVestingInstance.address
  ], { deployer, kind: 'uups' });
  console.log('Deployed AdvisorPool', AdvisorPoolInstance.address);

  const FounderTeamPoolInstance = await deployProxy(FounderTeamPool, [
    MELDInstance.address, 
    MELDVestingInstance.address
  ], { deployer, kind: 'uups' });
  console.log('Deployed FounderTeamPool', FounderTeamPoolInstance.address);
};