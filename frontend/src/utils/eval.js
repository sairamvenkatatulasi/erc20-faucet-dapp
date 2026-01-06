import { tokenContract, faucetContract, getSigner } from "./contracts";

window.__EVAL__ = {
  connectWallet: async () => {
    const signer = await getSigner();
    return signer.address;
  },

  requestTokens: async () => {
    const signer = await getSigner();
    const tx = await faucetContract(signer).requestTokens();
    await tx.wait();
    return tx.hash;
  },

  getBalance: async (addr) => {
    const bal = await tokenContract().balanceOf(addr);
    return bal.toString();
  },

  canClaim: async (addr) => {
    const signer = await getSigner();
    return await faucetContract(signer).canClaim(addr);
  },

  getRemainingAllowance: async (addr) => {
    const signer = await getSigner();
    const v = await faucetContract(signer).remainingAllowance(addr);
    return v.toString();
  },

  getContractAddresses: async () => ({
    token: import.meta.env.VITE_TOKEN_ADDRESS,
    faucet: import.meta.env.VITE_FAUCET_ADDRESS,
  }),
};
