import { ethers } from "ethers";
import tokenAbi from "./Token.json";
import faucetAbi from "./TokenFaucet.json";

const provider = new ethers.BrowserProvider(window.ethereum);

export async function getSigner() {
  return provider.getSigner();
}

export function tokenContract() {
  return new ethers.Contract(
    import.meta.env.VITE_TOKEN_ADDRESS,
    tokenAbi,
    provider
  );
}

export function faucetContract(signer) {
  return new ethers.Contract(
    import.meta.env.VITE_FAUCET_ADDRESS,
    faucetAbi,
    signer
  );
}
