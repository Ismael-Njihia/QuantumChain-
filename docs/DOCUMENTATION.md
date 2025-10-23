# QuantumChain Platform Documentation

## Overview

QuantumChain is a cutting-edge blockchain platform that integrates post-quantum cryptography with a hybrid Proof-of-Stake consensus mechanism. The platform features an ERC-20 QCN token, a decentralized exchange (DEX), secure anonymous wallets, and IPFS document storage.

## Architecture

### Frontend (React.js)
- **Location**: `/frontend`
- **Framework**: React.js 18.2
- **UI Library**: Material-UI (MUI)
- **Key Features**:
  - Wallet integration (MetaMask)
  - Token purchase interface
  - DEX trading interface
  - Anonymous wallet management
  - Responsive design

### Backend (Node.js)
- **Location**: `/backend`
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose)
- **Key Features**:
  - User registration and authentication
  - Token sale management (pre-sale, main sale)
  - DEX order management
  - IPFS document storage
  - Post-quantum cryptography integration

### Blockchain (Ethereum)
- **Location**: `/blockchain`
- **Framework**: Hardhat
- **Language**: Solidity 0.8.20
- **Contracts**:
  - **QCNToken**: ERC-20 token with additional features
  - **QuantumDEX**: Decentralized exchange contract

## Features

### 1. Post-Quantum Cryptography
- Integration with quantum-resistant algorithms
- Future-proof security for wallets and transactions
- Algorithm: CRYSTALS-Kyber (placeholder for production implementation)

### 2. Hybrid PoS Consensus
- Energy-efficient consensus mechanism
- Fast transaction finality
- Staking rewards for token holders

### 3. ERC-20 QCN Token
- Total Supply: 100 million QCN
- Pre-sale: 10 million QCN (25% bonus)
- Main Sale: 50 million QCN (10% bonus)
- Features: Burnable, Pausable, Blacklist capability

### 4. Decentralized Exchange (DEX)
- Order book trading
- Market and limit orders
- Low trading fees (0.25%)
- Real-time order matching

### 5. Secure Anonymous Wallets
- Quantum-resistant key generation
- Privacy-focused transactions
- MetaMask integration
- Hardware wallet support

### 6. IPFS Document Storage
- Decentralized file storage
- Content addressing
- Permanent document archival
- Access control

## Installation & Setup

### Prerequisites
- Node.js v16 or higher
- MongoDB
- MetaMask browser extension
- Git

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000`

### Backend Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the server:
```bash
npm start
# or for development
npm run dev
```

The backend will run on `http://localhost:5000`

### Blockchain Setup

1. Install dependencies:
```bash
cd blockchain
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Add your Infura project ID and private key
```

3. Compile contracts:
```bash
npm run compile
```

4. Deploy contracts:
```bash
# Local deployment
npx hardhat run scripts/deploy.js --network localhost

# Testnet deployment (Sepolia)
npx hardhat run scripts/deploy.js --network sepolia

# Mainnet deployment
npx hardhat run scripts/deploy.js --network mainnet
```

## Token Sale Phases

### Pre-Sale
- **Price**: 0.0008 ETH per QCN
- **Bonus**: 25%
- **Supply**: 10 million QCN
- **Min Purchase**: 100 QCN

### Main Sale
- **Price**: 0.001 ETH per QCN
- **Bonus**: 10%
- **Supply**: 50 million QCN
- **Min Purchase**: 50 QCN

### Post-Launch Strategy
1. **DEX Listing**: List QCN on the platform DEX
2. **Liquidity Provision**: Add liquidity pools
3. **Market Making**: Stabilize token price
4. **Staking**: Enable staking for PoS consensus
5. **Community Rewards**: Distribute rewards to early adopters

## API Endpoints

### User Management
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (authenticated)

### Token Operations
- `GET /api/tokens/price` - Get current token price
- `POST /api/tokens/purchase` - Purchase tokens (authenticated)
- `GET /api/tokens/balance/:address` - Get token balance (authenticated)
- `POST /api/tokens/transfer` - Transfer tokens (authenticated)

### DEX Operations
- `POST /api/dex/orders` - Create new order (authenticated)
- `GET /api/dex/orders` - Get user orders (authenticated)
- `GET /api/dex/orderbook` - Get order book (authenticated)
- `POST /api/dex/orders/:orderId/execute` - Execute order (authenticated)
- `DELETE /api/dex/orders/:orderId` - Cancel order (authenticated)

### IPFS Operations
- `POST /api/ipfs/upload` - Upload file to IPFS (authenticated)
- `GET /api/ipfs/file/:hash` - Retrieve file from IPFS

## Security Features

### 1. Post-Quantum Cryptography
- Protects against quantum computer attacks
- Uses lattice-based cryptography
- Future-proof key generation

### 2. Smart Contract Security
- OpenZeppelin contracts
- Reentrancy protection
- Access control
- Pausable functionality

### 3. Backend Security
- JWT authentication
- Rate limiting
- Helmet.js for HTTP headers
- Input validation with Joi
- Password hashing with bcrypt

### 4. Anonymous Wallets
- No KYC required for basic usage
- Privacy-preserving transactions
- Optional verification for higher limits

## Development Workflow

### Testing
```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test

# Smart contract tests
cd blockchain
npm test
```

### Deployment
1. Build frontend: `cd frontend && npm run build`
2. Deploy backend to server
3. Deploy smart contracts to network
4. Update contract addresses in backend config
5. Update API URL in frontend config

## Maintenance

### Monitoring
- Backend health check: `GET /health`
- Monitor transaction volume
- Track token price movements
- Monitor DEX liquidity

### Updates
- Regular security audits
- Smart contract upgrades
- Frontend UI improvements
- Backend optimization

## Troubleshooting

### Common Issues

1. **MetaMask not connecting**
   - Ensure MetaMask is installed
   - Check network configuration
   - Verify account is unlocked

2. **Transaction failing**
   - Check gas price
   - Verify account balance
   - Ensure contract is not paused

3. **IPFS upload failing**
   - Verify IPFS node is running
   - Check file size limits
   - Ensure authentication token is valid

## Support

For technical support or questions:
- GitHub Issues: [Repository Issues]
- Documentation: This file
- Community: [Discord/Telegram]

## License

MIT License - See LICENSE file for details

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create pull request

## Roadmap

### Phase 1 (Current)
- [x] Platform architecture
- [x] Smart contracts
- [x] Frontend UI
- [x] Backend API
- [x] Token sale

### Phase 2 (Q1 2024)
- [ ] Mainnet deployment
- [ ] Security audit
- [ ] Mobile app
- [ ] Enhanced DEX features

### Phase 3 (Q2 2024)
- [ ] Staking mechanism
- [ ] Governance system
- [ ] Cross-chain bridges
- [ ] Advanced analytics

### Phase 4 (Q3-Q4 2024)
- [ ] Layer 2 scaling
- [ ] DeFi integrations
- [ ] NFT marketplace
- [ ] Enterprise solutions
