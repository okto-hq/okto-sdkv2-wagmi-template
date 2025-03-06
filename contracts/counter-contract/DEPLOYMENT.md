# Deploying the Counter Contract to Base Sepolia

Follow these steps to deploy the Counter contract to Base Sepolia testnet.

## Prerequisites

1. Make sure you have [Foundry](https://book.getfoundry.sh/) installed
2. You need ETH on Base Sepolia testnet for your deployer address
   - Get Base Sepolia ETH from the [Base faucet](https://www.base.org/faucet)

## Setup

1. Edit the `.env` file in the counter-contract directory:
   ```
   PRIVATE_KEY=your_private_key_here
   BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
   ETHERSCAN_API_KEY=your_etherscan_api_key_if_you_have_one
   ```

   Replace `your_private_key_here` with your actual private key (without the 0x prefix).

2. Make the `.env` file is in the `.gitignore` to avoid committing your private key.

## Deployment

Run the following command to deploy to Base Sepolia:

```bash
forge script script/DeployToBaseSepolia.s.sol --rpc-url base_sepolia --broadcast --verify
```

The contract address will be output in the console. Make note of this address as you'll need it for the frontend.

## Verification

If you provided an Etherscan API key, the contract should be automatically verified. Otherwise, you can verify it manually on the Base Sepolia explorer:

[Base Sepolia Explorer](https://sepolia.basescan.org/)

## Updating the Frontend

After deployment, update the `COUNTER_ADDRESS` in `src/app/components/Counter.tsx` with your deployed contract address. 