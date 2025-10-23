# QuantumChain - Post-Quantum Blockchain Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-orange.svg)](https://soliditylang.org/)

QuantumChain is a groundbreaking blockchain platform that harnesses the power of quantum-inspired technologies to deliver unparalleled speed, security, and scalability. By integrating advanced post-quantum cryptography and a hybrid consensus mechanism, QuantumChain is set to redefine the future of decentralized finance and digital assets.

## 🚀 Features

### Core Technologies
- **Post-Quantum Cryptography**: Future-proof security using quantum-resistant algorithms (CRYSTALS-Kyber)
- **Hybrid PoS Consensus**: Energy-efficient Proof-of-Stake mechanism for fast transactions
- **ERC-20 QCN Token**: Fully compliant token with 100M total supply
- **Decentralized Exchange**: Order book-based DEX with low fees (0.25%)
- **Anonymous Wallets**: Privacy-focused wallet system with quantum-resistant keys
- **IPFS Integration**: Decentralized document storage and retrieval

### Platform Components
1. **Frontend (React.js)**
   - Modern, responsive UI with Material-UI
   - MetaMask wallet integration
   - Real-time DEX trading interface
   - Token purchase and management

2. **Backend (Node.js)**
   - RESTful API with Express.js
   - MongoDB database
   - JWT authentication
   - IPFS file management
   - Rate limiting and security

3. **Blockchain (Ethereum)**
   - Solidity smart contracts
   - Hardhat development environment
   - OpenZeppelin security standards
   - Multi-network deployment support

## 📦 Installation

### Prerequisites
```bash
# Required software
- Node.js v16 or higher
- MongoDB v4.4 or higher
- Git
- MetaMask browser extension (for frontend)
```

### Quick Start

#### 1. Clone the Repository
```bash
git clone https://github.com/Ismael-Njihia/QuantumChain-.git
cd QuantumChain-
```

#### 2. Setup Frontend
```bash
cd frontend
npm install
npm start
```
Frontend runs on `http://localhost:3000`

#### 3. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```
Backend runs on `http://localhost:5000`

#### 4. Setup Blockchain
```bash
cd blockchain
npm install
cp .env.example .env
# Add Infura project ID and private key to .env
npm run compile
npx hardhat run scripts/deploy.js --network localhost
```

## 🏗️ Project Structure

```
QuantumChain-/
├── frontend/           # React.js frontend application
│   ├── public/        # Static assets
│   └── src/
│       ├── components/ # Reusable UI components
│       ├── pages/     # Page components
│       ├── services/  # API and blockchain services
│       └── utils/     # Utility functions
│
├── backend/           # Node.js backend server
│   └── src/
│       ├── config/    # Configuration files
│       ├── controllers/ # Route controllers
│       ├── middleware/ # Express middleware
│       ├── models/    # MongoDB models
│       ├── routes/    # API routes
│       └── services/  # Business logic services
│
├── blockchain/        # Ethereum smart contracts
│   ├── contracts/    # Solidity contracts
│   ├── scripts/      # Deployment scripts
│   └── test/         # Contract tests
│
└── docs/             # Documentation
```

## 💎 QCN Token

### Token Details
- **Name**: QuantumChain Network
- **Symbol**: QCN
- **Total Supply**: 100,000,000 QCN
- **Standard**: ERC-20
- **Features**: Burnable, Pausable, Owner-controlled minting

### Token Distribution
- Pre-sale: 10M QCN (10%)
- Main Sale: 50M QCN (50%)
- Liquidity: 10M QCN (10%)
- Team & Development: 20M QCN (20%)
- Community Rewards: 10M QCN (10%)

### Token Sale Phases

#### Pre-Sale
- **Price**: 0.0008 ETH per QCN
- **Bonus**: 25%
- **Min Purchase**: 100 QCN
- **Hard Cap**: 10M QCN

#### Main Sale
- **Price**: 0.001 ETH per QCN
- **Bonus**: 10%
- **Min Purchase**: 50 QCN
- **Hard Cap**: 50M QCN

## 🔐 Security

### Smart Contract Security
- Built with OpenZeppelin contracts
- Reentrancy protection
- Access control mechanisms
- Pausable functionality
- Comprehensive testing

### Backend Security
- JWT authentication
- Password hashing (bcrypt)
- Rate limiting
- Helmet.js security headers
- Input validation (Joi)

### Post-Quantum Security
- Quantum-resistant key generation
- Future-proof cryptographic algorithms
- Protection against quantum computer attacks

## 🛠️ API Documentation

### Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

### User Endpoints
```
POST   /api/users/register  - Register new user
POST   /api/users/login     - User login
GET    /api/users/profile   - Get user profile (protected)
```

### Token Endpoints
```
GET    /api/tokens/price           - Get current token price
POST   /api/tokens/purchase        - Purchase tokens (protected)
GET    /api/tokens/balance/:address - Get token balance (protected)
POST   /api/tokens/transfer        - Transfer tokens (protected)
```

### DEX Endpoints
```
POST   /api/dex/orders              - Create order (protected)
GET    /api/dex/orders              - Get user orders (protected)
GET    /api/dex/orderbook           - Get order book (protected)
POST   /api/dex/orders/:id/execute  - Execute order (protected)
DELETE /api/dex/orders/:id          - Cancel order (protected)
```

### IPFS Endpoints
```
POST   /api/ipfs/upload      - Upload file (protected)
GET    /api/ipfs/file/:hash  - Get file
```

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
npm test
```

### Smart Contract Tests
```bash
cd blockchain
npx hardhat test
```

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy build/ folder to hosting service (Vercel, Netlify, etc.)
```

### Backend Deployment
```bash
cd backend
# Deploy to your server (AWS, Heroku, DigitalOcean, etc.)
# Ensure MongoDB is accessible
# Set environment variables
```

### Smart Contract Deployment
```bash
cd blockchain

# Testnet (Sepolia)
npx hardhat run scripts/deploy.js --network sepolia

# Mainnet
npx hardhat run scripts/deploy.js --network mainnet
```

## 📊 Use Cases

1. **DeFi Trading**: Trade QCN tokens on the decentralized exchange
2. **Token Investment**: Participate in pre-sale and main sale
3. **Staking**: Earn rewards through PoS consensus
4. **Document Storage**: Store files securely on IPFS
5. **Privacy Transactions**: Use anonymous wallets for private transfers
6. **Governance**: Vote on platform decisions (future feature)

## 🗺️ Roadmap

### Q4 2023 - Platform Launch
- ✅ Core platform development
- ✅ Smart contract deployment
- ✅ Frontend & backend implementation
- ✅ Token sale infrastructure

### Q1 2024 - Growth Phase
- [ ] Security audit
- [ ] Mainnet deployment
- [ ] Mobile application
- [ ] Enhanced DEX features
- [ ] Marketing campaign

### Q2 2024 - Expansion
- [ ] Staking mechanism
- [ ] Governance system
- [ ] Cross-chain bridges
- [ ] Partnerships
- [ ] CEX listings

### Q3-Q4 2024 - Enterprise
- [ ] Layer 2 scaling solution
- [ ] Enterprise solutions
- [ ] NFT marketplace
- [ ] Advanced analytics
- [ ] International expansion

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

QuantumChain is developed by a team of blockchain experts, cryptographers, and full-stack developers committed to building the future of decentralized finance.

## 📞 Contact & Support

- **Website**: [Coming Soon]
- **Email**: [Coming Soon]
- **Twitter**: [Coming Soon]
- **Discord**: [Coming Soon]
- **Telegram**: [Coming Soon]

## ⚠️ Disclaimer

This is a blockchain platform in active development. Always do your own research before investing in any cryptocurrency or token. The platform is provided "as is" without any warranties.

## 🙏 Acknowledgments

- OpenZeppelin for secure smart contract libraries
- Hardhat for Ethereum development environment
- React.js and Material-UI for frontend framework
- Express.js for backend framework
- IPFS for decentralized storage

---

**Built with ❤️ by the QuantumChain Team**

