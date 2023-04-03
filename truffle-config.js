const HDWalletProvider = require('@truffle/hdwallet-provider');
const DOTENV = require("dotenv");
DOTENV.config();


const MNEMONIC = process.env._mnemonic;
const GOERLI_KEY = process.env._goerliKey;
const BINANCE_KEY = process.env._binanceKey;
const FANTOM_KEY = process.env._fantomKey
module.exports = {
  contracts_build_directory: "./src/build/contracts",
  networks: {
    development: { 
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    goerli: { 
      provider: () => new HDWalletProvider(MNEMONIC, GOERLI_KEY),
      network_id: 5,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 600,
      skipDryRun: true
    },
    binanceTestnet: {
      provider: () => new HDWalletProvider(MNEMONIC, BINANCE_KEY),
      network_id: 97,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 600,
      skipDryRun: true
    },

    fantomTestnet: {
      provider: () => new HDWalletProvider(MNEMONIC, FANTOM_KEY),
      network_id: 4002,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 600,
      skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: "^0.8.2",    
    }
  },
}
