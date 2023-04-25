require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
require("@nomiclabs/hardhat-ethers")
require("dotenv/config")
require("solidity-coverage")
require("hardhat-deploy")
require("solidity-coverage")
const {HardhatUserConfig} = require("hardhat/config")
require("dotenv").config()

const PRIVATE_KEY = process.env.PRIVATE_KEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.17",
        settings: {
            optimizer: {
                enabled: true,
                runs: 1000,
                details: {yul: false}
            }
        }
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337
        },
        Hyperspace: {
            chainId: 3141,
            url: "https://api.hyperspace.node.glif.io/rpc/v1",
            accounts: [PRIVATE_KEY],
            timeout: 1000000
        },
        FilecoinMainnet: {
            chainId: 314,
            url: "https://api.node.glif.io",
            accounts: [PRIVATE_KEY]
        },
        Mumbai: {
            chainId: 80001,
            url: "https://matic-mumbai.chainstacklabs.com",
            accounts: [PRIVATE_KEY]
        },
        liberty: {
            url: "https://liberty20.shardeum.org/",
            chainId: 8081,
            accounts:[PRIVATE_KEY]
        },
        "mantle-testnet": {
            url: "https://rpc.testnet.mantle.xyz/",
            chainId: 5001,
            accounts: [PRIVATE_KEY]
        }
    },
    etherscan: {
        apiKey: process.env.MUMBAI_POLYGONSCAN,
        customChains: [
            {
                network: "mantle-testnet",
                chainId: 5001,
                urls: {
                    apiURL: "https://explorer.testnet.mantle.xyz/api",
                    browserURL: "https://explorer.testnet.mantle.xyz/"
                }
            }
        ],
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    }
}
