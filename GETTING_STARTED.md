# Getting Started with QuantumChain

This guide will help you get the QuantumChain platform up and running on your local machine for development and testing purposes.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/downloads)
- **MetaMask** browser extension - [Install](https://metamask.io/)

## Quick Start (5 Minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/Ismael-Njihia/QuantumChain-.git
cd QuantumChain-
```

### 2. Start MongoDB

```bash
# On macOS/Linux
mongod --dbpath ~/data/db

# On Windows
mongod --dbpath C:\data\db
```

### 3. Setup Backend

Open a new terminal:

```bash
cd backend
npm install
cp .env.example .env

# Edit .env file and set:
# - JWT_SECRET to a random string
# - MongoDB URI (default should work)

npm start
```

Backend will run on `http://localhost:5000`

### 4. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
npm start
```

Frontend will open automatically at `http://localhost:3000`

### 5. Setup Blockchain (Optional for Local Testing)

Open another terminal:

```bash
cd blockchain
npm install

# Start local Hardhat node
npx hardhat node

# In another terminal, deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

## First Steps in the Application

### 1. Connect Your Wallet

1. Open the app at `http://localhost:3000`
2. Click "Connect Wallet" in the navigation bar
3. Approve the MetaMask connection
4. Your wallet is now connected!

### 2. Register an Account

1. Navigate to the home page
2. The system will generate a quantum-resistant wallet for you
3. Your address and balance will be displayed

### 3. Explore the Platform

- **Home Page**: View platform features and QCN token details
- **Wallet Page**: Manage your wallet and send transactions
- **Token Sale Page**: Purchase QCN tokens during pre-sale or main sale
- **DEX Page**: Trade QCN tokens on the decentralized exchange

## Development Workflow

### Running the Full Stack

You need 4 terminal windows:

**Terminal 1 - MongoDB:**
```bash
mongod --dbpath ~/data/db
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev  # Auto-restart on changes
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm start  # Auto-refresh on changes
```

**Terminal 4 - Blockchain (optional):**
```bash
cd blockchain
npx hardhat node
```

### Making Changes

#### Frontend Changes
- Edit files in `frontend/src/`
- The browser will automatically reload
- Check console for errors

#### Backend Changes
- Edit files in `backend/src/`
- Server auto-restarts (using nodemon)
- Check terminal for errors

#### Smart Contract Changes
- Edit files in `blockchain/contracts/`
- Recompile: `npx hardhat compile`
- Redeploy: `npx hardhat run scripts/deploy.js --network localhost`

## Common Tasks

### View API Endpoints

Backend health check:
```bash
curl http://localhost:5000/health
```

Get token price:
```bash
curl http://localhost:5000/api/tokens/price
```

### Test Smart Contracts

```bash
cd blockchain
npx hardhat test
```

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
# Output in build/ directory
```

**Backend:**
```bash
cd backend
# Already production-ready, just deploy
```

## Troubleshooting

### Frontend won't start
- Check Node.js version: `node --version` (should be v16+)
- Delete `node_modules` and `package-lock.json`, then `npm install`
- Check port 3000 is not in use

### Backend won't start
- Ensure MongoDB is running
- Check `.env` file exists and is configured
- Check port 5000 is not in use
- Verify all environment variables are set

### MetaMask not connecting
- Ensure MetaMask is installed and unlocked
- Check you're on the correct network (localhost:8545 for local)
- Try disconnecting and reconnecting
- Clear MetaMask cache if needed

### Smart contracts failing to deploy
- Ensure Hardhat node is running
- Check you have test ETH in your account
- Verify contract compilation succeeded: `npx hardhat compile`
- Check for syntax errors in Solidity files

### MongoDB connection errors
- Verify MongoDB is running: `mongosh` or `mongo`
- Check connection string in `.env`
- Ensure MongoDB port (27017) is not blocked
- Try connecting manually: `mongosh mongodb://localhost:27017/quantumchain`

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/quantumchain
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d

ETHEREUM_NETWORK=localhost
INFURA_PROJECT_ID=your-infura-id
PRIVATE_KEY=your-private-key

IPFS_HOST=ipfs.infura.io
IPFS_PORT=5001
IPFS_PROTOCOL=https

PRESALE_PRICE=0.0008
MAINSALE_PRICE=0.001
PRESALE_BONUS=25
MAINSALE_BONUS=10
```

### Frontend (.env.local)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CHAIN_ID=1337
```

### Blockchain (.env)
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your-testnet-private-key
ETHERSCAN_API_KEY=your-etherscan-api-key
```

## Testing with Real Data

### Purchase Tokens

1. Go to Token Sale page
2. Select Pre-Sale or Main Sale
3. Enter amount of QCN tokens to purchase
4. Click "Purchase Tokens"
5. Confirm the transaction in MetaMask (testnet)

### Create a Trade Order

1. Go to DEX page
2. Select Buy or Sell
3. Enter amount and price
4. Click "Place Order"
5. View your order in the Order Book

### Upload to IPFS

1. Use the IPFS upload endpoint via API:
```bash
curl -X POST http://localhost:5000/api/ipfs/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/file"
```

## Learning Resources

### Documentation
- [Complete Documentation](docs/DOCUMENTATION.md)
- [Smart Contract Guide](docs/SMART_CONTRACTS.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Security Analysis](docs/SECURITY_ANALYSIS.md)
- [Project Summary](docs/PROJECT_SUMMARY.md)

### Technologies
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [ethers.js Documentation](https://docs.ethers.org/)

## Next Steps

After getting comfortable with the basics:

1. **Explore the Code**: Understand the architecture
2. **Run Tests**: Write and run unit tests
3. **Deploy to Testnet**: Try deploying on Sepolia
4. **Customize**: Modify features to your needs
5. **Contribute**: Submit PRs with improvements

## Getting Help

- **GitHub Issues**: Report bugs or ask questions
- **Documentation**: Check the docs/ folder
- **Code Comments**: Read inline code comments
- **Stack Overflow**: Search for similar issues

## Development Tips

### Hot Reload Everything
- Frontend auto-reloads on file changes
- Backend auto-restarts with nodemon
- Use `npx hardhat watch compilation` for contracts

### Debug Mode
- Frontend: Open browser DevTools (F12)
- Backend: Use `console.log()` or debugger
- Smart Contracts: Use Hardhat console logs

### Code Quality
- ESLint: `npm run lint`
- Prettier: `npm run format`
- Type checking: Use JSDoc comments

### Performance
- React DevTools: Profile component renders
- MongoDB: Check query performance with `.explain()`
- Gas Usage: Monitor with Hardhat gas reporter

## Security Notes for Development

⚠️ **Never commit:**
- Private keys
- API keys
- JWT secrets
- Production credentials

✅ **Always:**
- Use `.env` files (in `.gitignore`)
- Use test accounts for development
- Test on testnet before mainnet
- Keep dependencies updated

## Sample Development Session

```bash
# 1. Start all services
mongod &
cd backend && npm run dev &
cd frontend && npm start &

# 2. Make changes to code
# Edit files...

# 3. Test changes
npm test

# 4. Deploy to testnet
cd blockchain
npx hardhat run scripts/deploy.js --network sepolia

# 5. Commit changes
git add .
git commit -m "Add new feature"
git push
```

## Congratulations! 🎉

You now have QuantumChain running locally. Start exploring, building, and contributing!

For detailed information on specific components, check the documentation in the `docs/` folder.

Happy coding! 🚀
