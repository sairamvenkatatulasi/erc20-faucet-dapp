import { expect } from "chai";
import hardhat from "hardhat";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs.js";


const { ethers } = hardhat;



describe("ERC20 Faucet DApp", function () {
  let token, faucet;
  let owner, user1, user2;

  const FAUCET_AMOUNT = ethers.parseEther("100");
  const MAX_CLAIM = ethers.parseEther("1000");
  const DAY = 24 * 60 * 60;
 

  beforeEach(async () => {
  [owner, user1, user2] = await ethers.getSigners();

  const Faucet = await ethers.getContractFactory("TokenFaucet");
  faucet = await Faucet.deploy(ethers.ZeroAddress);
  await faucet.waitForDeployment();

  const Token = await ethers.getContractFactory("FaucetToken");
  token = await Token.deploy(await faucet.getAddress());
  await token.waitForDeployment();

  // 🔥 IMPORTANT: update faucet to know the token
  await faucet.setToken(await token.getAddress());
});

  
   it("dummy test", async function () {
    expect(true).to.equal(true);
  });

  it("deploys token and faucet correctly", async () => {
    expect(await token.name()).to.equal("Faucet Token");
    expect(await token.symbol()).to.equal("FTK");
    expect(await faucet.admin()).to.equal(owner.address);
  });

  it("allows first successful claim", async () => {
    await faucet.connect(user1).requestTokens();
    const balance = await token.balanceOf(user1.address);
    expect(balance).to.equal(FAUCET_AMOUNT);
  });

  it("emits TokensClaimed event", async () => {
  await expect(faucet.connect(user1).requestTokens())
    .to.emit(faucet, "TokensClaimed")
    .withArgs(user1.address, FAUCET_AMOUNT, anyValue);
});


  it("prevents claim during cooldown", async () => {
    await faucet.connect(user1).requestTokens();
    await expect(
      faucet.connect(user1).requestTokens()
    ).to.be.revertedWith("Cooldown or limit reached");
  });

  it("allows claim after 24 hours", async () => {
    await faucet.connect(user1).requestTokens();
    await ethers.provider.send("evm_increaseTime", [DAY]);
    await ethers.provider.send("evm_mine");

    await faucet.connect(user1).requestTokens();
    const bal = await token.balanceOf(user1.address);
    expect(bal).to.equal(FAUCET_AMOUNT * 2n);
  });

  it("enforces lifetime claim limit", async () => {
    for (let i = 0; i < 10; i++) {
      await faucet.connect(user1).requestTokens();
      await ethers.provider.send("evm_increaseTime", [DAY]);
      await ethers.provider.send("evm_mine");
    }

   await expect(
  faucet.connect(user1).requestTokens()
).to.be.revertedWith("Cooldown or limit reached");

  });

  it("tracks totalClaimed correctly", async () => {
    await faucet.connect(user1).requestTokens();
    const claimed = await faucet.totalClaimed(user1.address);
    expect(claimed).to.equal(FAUCET_AMOUNT);
  });

  it("tracks lastClaimAt timestamp", async () => {
    await faucet.connect(user1).requestTokens();
    const ts = await faucet.lastClaimAt(user1.address);
    expect(ts).to.be.gt(0);
  });

  it("canClaim returns correct values", async () => {
    expect(await faucet.canClaim(user1.address)).to.equal(true);
    await faucet.connect(user1).requestTokens();
    expect(await faucet.canClaim(user1.address)).to.equal(false);
  });

  it("remainingAllowance returns correct value", async () => {
    await faucet.connect(user1).requestTokens();
    const remaining = await faucet.remainingAllowance(user1.address);
    expect(remaining).to.equal(MAX_CLAIM - FAUCET_AMOUNT);
  });

  it("admin can pause faucet", async () => {
    await faucet.setPaused(true);
    expect(await faucet.isPaused()).to.equal(true);
  });

  it("non-admin cannot pause faucet", async () => {
    await expect(
      faucet.connect(user1).setPaused(true)
    ).to.be.revertedWith("Only admin");
  });

  it("prevents claims when paused", async () => {
    await faucet.setPaused(true);
    await expect(
      faucet.connect(user1).requestTokens()
    ).to.be.revertedWith("Faucet is paused");
  });

  it("allows multiple users independently", async () => {
    await faucet.connect(user1).requestTokens();
    await faucet.connect(user2).requestTokens();

    expect(await token.balanceOf(user1.address)).to.equal(FAUCET_AMOUNT);
    expect(await token.balanceOf(user2.address)).to.equal(FAUCET_AMOUNT);
  });
});

/* helper */
async function time() {
  const block = await ethers.provider.getBlock("latest");
  return block.timestamp;
}
