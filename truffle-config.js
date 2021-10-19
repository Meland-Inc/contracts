const HDWalletProvider = require('@truffle/hdwallet-provider');

const fs = require('fs');

/// token owner的私钥.
/// 并且将这个更好更安全的存放起来. 只有在deploy 跟 upgrade 的时候才需要.
/// https://docs.matic.network/docs/develop/truffle#truffle-config.
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {

  networks: {
    develop: {
      host: "127.0.0.1",
      port: 8545,          
      gasPrice: 55000000000, 
      network_id: "*",
    },

    mainnet: {
      provider: () => new HDWalletProvider(mnemonic, `wss://mainnet.infura.io/ws/v3/692f82659c8941269cb7fd7b12bb70af`),
      network_id: 1,
      gasPrice: 55000000000,
      confirmations: 0,
      timeoutBlocks: 200,
      skipDryRun: true
    },

    // polygon test network
    mumbaimatic: {
      provider: () => new HDWalletProvider(mnemonic, `https://rpc-mumbai.matic.today`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },

    // polygon main network
    matic: {
      provider: () => new HDWalletProvider(mnemonic, `https://rpc-mainnet.matic.network`),
      network_id: 137,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },

    goerli: {
      provider: () => new HDWalletProvider(mnemonic, `wss://goerli.infura.io/ws/v3/c08566eb93d345ff80670a8a60906ef2`),
      network_id: 5,
      confirmations: 0,
      timeoutBlocks: 2000,
      gasPrice: 55000000000,
      skipDryRun: true
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  },

  // Truffle DB is currently disabled by default; to enable it, change enabled:
  // false to enabled: true. The default storage location can also be
  // overridden by specifying the adapter settings, as shown in the commented code below.
  //
  // NOTE: It is not possible to migrate your contracts to truffle DB and you should
  // make a backup of your artifacts to a safe location before enabling this feature.
  //
  // After you backed up your artifacts you can utilize db by running migrate as follows: 
  // $ truffle migrate --reset --compile-all
  //
  // db: {
    // enabled: false,
    // host: "127.0.0.1",
    // adapter: {
    //   name: "sqlite",
    //   settings: {
    //     directory: ".db"
    //   }
    // }
  // }
};
