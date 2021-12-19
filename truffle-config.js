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
      gas: 6721975,
      confirmations: 0,
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
    mumbai: {
      provider: () => new HDWalletProvider(mnemonic, `wss://polygon-mumbai.g.alchemy.com/v2/fIbA8DRSTQXPAhcHKiPFo19SPqhHNHam`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },

    // polygon main network
    matic: {
      provider: () => new HDWalletProvider(mnemonic, `https://polygon-mainnet.g.alchemy.com/v2/y48IcelCwZwwppoj-CXBEwmIjBOZ2ZLt`),
      network_id: 137,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },

    bsctest: {
      provider: () => new HDWalletProvider(mnemonic, `https://data-seed-prebsc-1-s1.binance.org:8545`),
      network_id: 97,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },

    bsc: {
      provider: () => new HDWalletProvider(mnemonic, `https://speedy-nodes-nyc.moralis.io/036db9847a8d6409b3dbcddc/bsc/mainnet`),
      network_id: 56,
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
    },

    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `wss://speedy-nodes-nyc.moralis.io/036db9847a8d6409b3dbcddc/eth/rinkeby/archive/ws`),
      network_id: 4,
      confirmations: 0,
      gasPrice: 55000000000,
      timeoutBlocks: 2000,
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
      version: "0.8.9",
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200, // Default: 200
        },
      },
    }
  },

  plugins: [ 'truffle-plugin-verify' ],
  api_keys: {
    etherscan: 'G346MADBZS299Y7G5HJMQRX87UGPAF7RXB',
    polygonscan: 'A4HFFESE15HQP8S87RW8I6MNJGI36DQJMA',
    bscscan: 'HUVV8DK1VECFHERZDGCHJA52K87574QUU2'
  }
};
