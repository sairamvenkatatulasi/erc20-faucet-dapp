import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // 1. Deploy Faucet first (temporary token = zero)
  const Faucet = await ethers.getContractFactory("TokenFaucet");
  const faucet = await Faucet.deploy(ethers.ZeroAddress);
  await faucet.waitForDeployment();

  // 2. Deploy Token with faucet as minter
  const Token = await ethers.getContractFactory("FaucetToken");
  const token = await Token.deploy(await faucet.getAddress());
  await token.waitForDeployment();

  // 3. Set token in faucet
  const tx = await faucet.setToken(await token.getAddress());
  await tx.wait();

  console.log("✅ Token deployed at:", await token.getAddress());
  console.log("✅ Faucet deployed at:", await faucet.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
