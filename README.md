A full-stack decentralized application (DApp) that implements an ERC-20 token faucet with on-chain rate limiting, lifetime claim limits, wallet integration, and Dockerized deployment.
The project demonstrates end-to-end Web3 engineering including smart contract design, testing, deployment, frontend integration, and DevOps readiness.

📌 Project Overview

This DApp allows users to claim a fixed amount of ERC-20 tokens from a faucet while enforcing:

⏳ 24-hour cooldown between claims

📊 Lifetime maximum claim limit per address

⛔ Admin-controlled pause/unpause

🔐 On-chain enforcement (no centralized backend)

The frontend connects to MetaMask (EIP-1193 compliant wallets), displays real-time balances, claim eligibility, and provides clear feedback for transaction states and errors.

🏗️ Architecture
submission/
├── contracts/
│   ├── FaucetToken.sol        # ERC-20 token contract
│   ├── TokenFaucet.sol        # Faucet with rate limiting
│   └── test/
│       └── TokenFaucet.test.js
├── scripts/
│   └── deploy.js              # Deployment script
├── frontend/
│   ├── src/                   # Vite + React frontend
│   ├── Dockerfile
│   ├── package.json
│   └── .dockerignore
├── docker-compose.yml
├── hardhat.config.js
├── .env
└── README.md

🔗 Deployed Contracts (Sepolia)

✅ Contracts are deployed and verified on Sepolia testnet.

ERC-20 Token:
https://sepolia.etherscan.io/address/0xTOKEN_ADDRESS

Faucet Contract:
https://sepolia.etherscan.io/address/0xFAUCET_ADDRESS

(Replace with your actual deployed addresses)

⚙️ Smart Contract Design
ERC-20 Token (FaucetToken.sol)

Fully ERC-20 compliant

Fixed maximum supply

Only the faucet contract can mint tokens

Emits standard Transfer events

Faucet (TokenFaucet.sol)

Fixed token amount per claim

24-hour cooldown enforced on-chain

Lifetime maximum claim limit per address

Tracks:

lastClaimAt[address]

totalClaimed[address]

Admin-only pause/unpause

Emits:

TokensClaimed(address, amount, timestamp)

FaucetPaused(bool)

🧪 Testing Strategy

Written using Hardhat + Chai

Covers:

Successful claims

Cooldown enforcement

Lifetime limit enforcement

Pause/unpause logic

Admin access control

Event emissions

Multiple users claiming independently

Time-dependent logic tested using EVM time manipulation

Run tests:

npx hardhat test

🖥️ Frontend Features

Wallet connect / disconnect (MetaMask)

Displays:

Connected address

Token balance

Cooldown status

Remaining lifetime allowance

Claim button with disabled states

Loading indicators during transactions

Clear error messages for reverts and wallet rejections

Automatic UI updates after successful claims

/health endpoint for container readiness

🧪 Evaluation Interface (window.EVAL)

The frontend exposes a global evaluation interface for automated testing:

window.__EVAL__ = {
  connectWallet,
  requestTokens,
  getBalance,
  canClaim,
  getRemainingAllowance,
  getContractAddresses
};


All numeric values are returned as strings

Functions throw descriptive errors on failure

🐳 Docker & Deployment

The application is fully containerized and production-ready.

Prerequisites

Docker & Docker Compose

Quick Start
cp .env.example .env
docker compose up


Frontend will be available at:

http://localhost:3000


Health check:

http://localhost:3000/health
→ OK

🌍 Environment Variables
.env.example
VITE_RPC_URL=
VITE_TOKEN_ADDRESS=
VITE_FAUCET_ADDRESS=


⚠️ No secrets are committed.
All sensitive values are injected via environment variables.