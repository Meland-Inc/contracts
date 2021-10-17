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
  const MELDInstance = await deployProxy(MELD, [], { deployer, kind: 'uups' });
  console.log('Deployed MELD', MELDInstance.address);

  const MELDVestingInstance = await deployProxy(MELDVesting, [ MELDInstance.address ], { deployer, kind: 'uups' });
  console.log('Deployed MELDVesting', MELDVestingInstance.address);


  const MELDSeedSaleInstance = await deployProxy(MELDSeedSale, [ 
    MELDInstance.address, 
    MELDVestingInstance.address, 
    '0x4c5F93DEEa555225e946925D5030E2e600c0e835', 
    10
  ], { deployer, kind: 'uups' });
  console.log('Deployed MELDSeedSale', MELDSeedSaleInstance.address);

  const MELDPrivateSaleInstance = await deployProxy(MELDPrivateSale, [ 
    MELDInstance.address, 
    MELDVestingInstance.address, 
    '0x4c5F93DEEa555225e946925D5030E2e600c0e835', 
    10
  ], { deployer, kind: 'uups' });
  console.log('Deployed MELDPrivateSale', MELDPrivateSaleInstance.address);

  const MELDPublicSaleInstance = await deployProxy(MELDPublicSale, [ 
    MELDInstance.address, 
    MELDVestingInstance.address, 
    '0x4c5F93DEEa555225e946925D5030E2e600c0e835', 
    10
  ], { deployer, kind: 'uups' });
  console.log('Deployed MELDPublicSale', MELDPublicSaleInstance.address);
};