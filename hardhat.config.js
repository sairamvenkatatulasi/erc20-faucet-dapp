import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config = {
  solidity: "0.8.20",
};

if (process.env.SEPOLIA_RPC && process.env.PRIVATE_KEY) {
  config.networks = {
    sepolia: {
      url: process.env.SEPOLIA_RPC,
      accounts: [process.env.PRIVATE_KEY],
    },
  };
}

if (process.env.ETHERSCAN_KEY) {
  config.etherscan = {
    apiKey: process.env.ETHERSCAN_KEY,
  };
}

export default config;
