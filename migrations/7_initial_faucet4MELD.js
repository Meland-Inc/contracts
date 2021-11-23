/* eslint-disable no-undef */
const Faucet = artifacts.require("Faucet");
const MELD = artifacts.require("MELD");

module.exports = async function (deployer, network, accounts) {
    // 水龙头只部署在测试网络.
    if (![
        "mumbai",
        "develop",
        "test"
    ].includes(network)) {
        console.log("Deploy only on test networks");
        return;
    }

    const MELDInstance = await MELD.deployed();

    const FaucetInstance = await deployer.deploy(Faucet, [
        MELDInstance.address
    ]);

    await FaucetInstance.initialize(
        MELDInstance.address,
        process.env.gm
    );

    const banlance = await MELDInstance.balanceOf(accounts[0]);
    MELDInstance.transfer(FaucetInstance.address, banlance);
};