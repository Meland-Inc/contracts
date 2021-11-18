/* eslint-disable no-undef */
const NFTWithCidMigration = artifacts.require("NFTWithCidMigration");

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
    deployer.deploy(NFTWithCidMigration);
};