/* eslint-disable no-undef */
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const MELD = artifacts.require("MELD");
const Question = artifacts.require("Question");


module.exports = async function (deployer) {
  const instance = await deployProxy(MELD, [], { deployer });

  const questionInstance = await deployProxy(Question, [
    instance.address
  ], { deployer });

  console.log("deployed meld", instance.address);
  console.log("deployed question ", questionInstance.address);
};