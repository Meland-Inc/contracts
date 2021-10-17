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
  const MELDVestingInstance = await MELDVesting.deployed();

  const MELDSeedSaleInstance = await MELDSeedSale.deployed();

  const MELDPrivateSaleInstance = await MELDPrivateSale.deployed();

  const MELDPublicSaleInstance = await MELDPublicSale.deployed();
  
  const FoundationPoolInstance = await FoundationPool.deployed();

  const LiquidityPoolInstance = await LiquidityPool.deployed();

  const AdvisorPoolInstance = await AdvisorPool.deployed();

  const FounderTeamPoolInstance = await FounderTeamPool.deployed();

  await MELDVestingInstance.methods['setupVestingRole(address)'](FoundationPoolInstance.address);
  await MELDVestingInstance.methods['setupVestingRole(address)'](LiquidityPoolInstance.address);
  await MELDVestingInstance.methods['setupVestingRole(address)'](AdvisorPoolInstance.address);
  await MELDVestingInstance.methods['setupVestingRole(address)'](FounderTeamPoolInstance.address);
  await MELDVestingInstance.methods['setupVestingRole(address)'](MELDSeedSaleInstance.address);
  await MELDVestingInstance.methods['setupVestingRole(address)'](MELDPrivateSaleInstance.address);
  await MELDVestingInstance.methods['setupVestingRole(address)'](MELDPublicSaleInstance.address);
};