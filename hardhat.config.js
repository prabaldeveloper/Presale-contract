require('@nomiclabs/hardhat-waffle');
require('@openzeppelin/hardhat-upgrades');
// require('@nomicfoundation/hardhat-toolbox')
require("dotenv").config();

const SEPOLIA_RPC_URL = "https://rpc.ankr.com/eth_sepolia";
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;

const BINANCE_TESTNET_RPC_URL = "https://data-seed-prebsc-1-s3.binance.org:8545/";
const BINANCE_PRIVATE_KEY = process.env.BINANCE_PRIVATE_KEY;

const AVAX_TESTNET_RPC_URL = "https://api.avax-test.network/ext/bc/C/rpc";
const AVAX_PRIVATE_KEY = process.env.AVAX_PRIVATE_KEY;

const ETH_TESTNET_RPC_URL = "https://mainnet.infura.io/v3/a4e628983c9245df9af2a7242d00257a";
const ETH_PRIVATE_KEY  = process.env.ETH_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-sepolia.g.alchemy.com/v2/yI1MgYtinbSl5Ec-I4yVbOmXgWvyz89u",
      }
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      gasPrice: 2000000000000,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [SEPOLIA_PRIVATE_KEY],
      saveDeployments: true, 
    },
    bscTestnet: {
      url: BINANCE_TESTNET_RPC_URL,
      accounts: [BINANCE_PRIVATE_KEY],
      saveDeployments: true,
    },
    avaxTestnet: {
      url: AVAX_TESTNET_RPC_URL,
      accounts: [AVAX_PRIVATE_KEY],
      saveDeployments: true,
    },
    eth: {
      url: ETH_TESTNET_RPC_URL,
      accounts: [ETH_PRIVATE_KEY],
      saveDeployments: true,
    }
  },
  etherscan: {
    apiKey: {
      //polygonMumbai: "F3HN9IGWSZ5NYWEJBEM4Q214H2Q1BESN67",
      //polygon: "U6EEC7A855HA3IFWJ3Y9SC4XSPY4ZTS3JN",
      //"F3HN9IGWSZ5NYWEJBEM4Q214H2Q1BESN67",
      //goerli: "31ZSP2RQ25W2K34WWHWTFU2YPHWZ5K5JNQ",
      sepolia: "31ZSP2RQ25W2K34WWHWTFU2YPHWZ5K5JNQ",
      //bscTestnet: "UC16SKBJFHUXWW2KSHQAAM3HUTXT2P2BFE",
      //bsc: "UC16SKBJFHUXWW2KSHQAAM3HUTXT2P2BFE",
     // mainnet: "U1P3GDUXEUS8QUF8JWF5DRBUSSSPXC2E2H"
    },
  },
  solidity: {
    compilers: [

      {
        version: "0.8.2",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          }
        },
      },
      {
        version: "0.4.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          }
        },
      },
    ],
  }
};


// MockToken deployed to: 0xdEaDBC90d13f9a7F945AB5a295e6720bE5A575C5
// USDTToken deployed to: 0xbf4c95D61c8Bc3aA108d72f77b8f37374308Dc97
// TokenPresale deployed to: 0xDf9b2C059622BfB5813DE72212870713456De087