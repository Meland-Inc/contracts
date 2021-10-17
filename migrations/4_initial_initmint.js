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

module.exports = async function (deployer) {
    const MELDInstance = await MELD.deployed();

    const MELDSeedSaleInstance = await MELDSeedSale.deployed();

    const MELDPrivateSaleInstance = await MELDPrivateSale.deployed();

    const MELDPublicSaleInstance = await MELDPublicSale.deployed();

    const FoundationPoolInstance = await FoundationPool.deployed();

    const LiquidityPoolInstance = await LiquidityPool.deployed();

    const AdvisorPoolInstance = await AdvisorPool.deployed();

    const FounderTeamPoolInstance = await FounderTeamPool.deployed();

    console.debug(
        MELDInstance.address,
        MELDSeedSaleInstance.address,
        MELDPrivateSaleInstance.address,
        MELDPublicSaleInstance.address
    );

    await MELDInstance.methods['mint2MELDSale(address,address,address)'](
        MELDSeedSaleInstance.address,
        MELDPrivateSaleInstance.address,
        MELDPublicSaleInstance.address
    );

    // address _FoundationPoolAddress,
    // address _LiquidityPoolAddress,
    // address _AdvisorPoolAddress,
    // address _FoundersTeamPoolAddress
    await MELDInstance.methods['mint2MELDPool(address,address,address,address)'](
        FoundationPoolInstance.address,
        LiquidityPoolInstance.address,
        AdvisorPoolInstance.address,
        FounderTeamPoolInstance.address
    );
};