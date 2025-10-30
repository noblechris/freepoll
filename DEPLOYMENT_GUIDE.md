# Decentralized Polling System - Deployment Guide

## Overview
This guide will walk you through deploying the smart contract to Sepolia testnet and hosting the frontend on Vercel.

## Prerequisites
- MetaMask wallet installed
- Sepolia testnet ETH (get from [Sepolia Faucet](https://sepoliafaucet.com/))
- [Remix IDE](https://remix.ethereum.org/) for contract deployment
- GitHub account (for Vercel deployment)

---

## Part 1: Deploy Smart Contract to Sepolia

### Step 1: Get Sepolia Test ETH
1. Go to [Sepolia Faucet](https://sepoliafaucet.com/)
2. Enter your MetaMask wallet address
3. Request test ETH (you'll need some for gas fees)

### Step 2: Deploy Contract Using Remix

1. **Open Remix IDE**
   - Go to [https://remix.ethereum.org/](https://remix.ethereum.org/)

2. **Create New File**
   - In the File Explorer, create a new file called `PollSystem.sol`
   - Copy the entire content from `contracts/PollSystem.sol` and paste it

3. **Compile the Contract**
   - Go to the "Solidity Compiler" tab (left sidebar)
   - Select compiler version `0.8.19` or higher
   - Click "Compile PollSystem.sol"
   - Ensure compilation is successful (green checkmark)

4. **Deploy to Sepolia**
   - Go to "Deploy & Run Transactions" tab
   - Under "Environment", select "Injected Provider - MetaMask"
   - MetaMask will prompt you to connect - select your account
   - Ensure MetaMask is connected to "Sepolia Test Network"
   - Under "Contract", select "PollSystem"
   - Click "Deploy"
   - Confirm the transaction in MetaMask
   - Wait for deployment confirmation

5. **Copy Contract Address**
   - After deployment, you'll see the deployed contract under "Deployed Contracts"
   - Click the copy icon next to the contract address
   - **SAVE THIS ADDRESS** - you'll need it for the frontend!

### Step 3: Verify Your Contract (Optional but Recommended)

1. Go to [Sepolia Etherscan](https://sepolia.etherscan.io/)
2. Search for your contract address
3. Click "Contract" tab → "Verify and Publish"
4. Follow the verification wizard using the same compiler settings from Remix

---

## Part 2: Configure Frontend

### Step 1: Update Contract Address

1. Open `src/lib/contract.ts` in your code editor
2. Replace `YOUR_CONTRACT_ADDRESS_HERE` with your deployed contract address:

```typescript
export const CONTRACT_ADDRESS = "0xYourContractAddressHere";
```

3. Save the file

---

## Part 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Push Code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/polling-dapp.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Project**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `your-project.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? Y
   - Which scope? (select your account)
   - Link to existing project? N
   - Project name? (enter name)
   - In which directory is your code located? ./
   - Want to override settings? N

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

---

## Part 4: Test Your dApp

### Step 1: Connect Wallet
1. Visit your deployed Vercel URL
2. Ensure MetaMask is on Sepolia network
3. Click "Connect Wallet"
4. Approve connection in MetaMask

### Step 2: Create a Poll
1. Go to "Create" tab
2. Enter poll title (e.g., "What should we build next?")
3. Add at least 2 options
4. Set duration in minutes
5. Click "Create Poll"
6. Confirm transaction in MetaMask
7. Wait for confirmation

### Step 3: Vote on Poll
1. Go to "Polls" tab
2. Select an option
3. Click "Cast Vote"
4. Confirm transaction in MetaMask
5. Wait for confirmation

### Step 4: View Results
1. Wait for poll to end (or create a short poll for testing)
2. Click "Show Winner" on ended polls
3. View voting statistics

---

## Troubleshooting

### Common Issues

**1. MetaMask not connecting**
- Ensure MetaMask is installed
- Check you're on Sepolia network
- Try refreshing the page

**2. Transaction failing**
- Ensure you have enough Sepolia ETH
- Check gas price settings
- Verify contract address is correct

**3. "Contract not found" error**
- Verify contract address in `src/lib/contract.ts`
- Ensure contract is deployed to Sepolia
- Check you're on correct network

**4. Build errors on Vercel**
- Check all dependencies are in package.json
- Ensure no TypeScript errors locally
- Review Vercel build logs

**5. Polls not loading**
- Open browser console (F12)
- Check for errors
- Verify contract address
- Ensure connected to Sepolia

---

## Network Information

**Sepolia Testnet**
- Network Name: Sepolia
- RPC URL: https://sepolia.infura.io/v3/YOUR-PROJECT-ID
- Chain ID: 11155111
- Currency Symbol: ETH
- Block Explorer: https://sepolia.etherscan.io

---

## Get Testnet ETH

Free Sepolia faucets:
- [Alchemy Faucet](https://sepoliafaucet.com/)
- [Infura Faucet](https://www.infura.io/faucet/sepolia)
- [QuickNode Faucet](https://faucet.quicknode.com/ethereum/sepolia)

---

## Additional Resources

- [Remix Documentation](https://remix-ide.readthedocs.io/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Vercel Documentation](https://vercel.com/docs)
- [MetaMask Documentation](https://docs.metamask.io/)
- [Sepolia Testnet Explorer](https://sepolia.etherscan.io/)

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify MetaMask is connected to Sepolia
3. Ensure contract address is correctly configured
4. Check transaction status on Sepolia Etherscan

---

## Security Notes

⚠️ **Important:**
- This is a testnet deployment - NOT for production use
- Never share your private keys
- Only use testnet ETH
- Audit smart contracts before mainnet deployment
- Consider gas optimization for production

---

## Next Steps

After successful deployment:
- Share your dApp URL with others
- Create polls and test voting
- Monitor contract on Etherscan
- Consider adding features like poll categories
- Implement poll editing/deletion
- Add more voting mechanisms (weighted voting, etc.)

---

Congratulations! 🎉 Your decentralized polling dApp is now live on Sepolia testnet and hosted on Vercel.
