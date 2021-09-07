/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const MELD = artifacts.require("MELD");
const Question = artifacts.require("Question");
const Land = artifacts.require("Land");
const Marketplace = artifacts.require("Marketplace");


module.exports = async function (deployer) {
  // MELD deploy
  const meldInstance = await deployProxy(MELD, [], { deployer });

  // question deploy
  const questionInstance = await deployProxy(Question, [
    instance.address
  ], { deployer });

  // land deploy
  const landInstance = await deployProxy(Land, [ ], { deployer });

  // nft marketplace deploy
  const marketplaceInstance = await deployProxy(Marketplace, [
    meldInstance.address,
    
    25000
  ], { deployer });

  // 赋予题目合约铸造权限.
  // 通过这种方式来控制用户答题完成后获取MELD等.
  instance.contract.methods.setMinterRole(questionInstance.address);

  console.log("deployed meld", meldInstance.address);
  console.log("deployed question ", questionInstance.address);
  console.log("deployed land ", landInstance.address);
  console.log("deployed marketplace ", marketplaceInstance.address);
};