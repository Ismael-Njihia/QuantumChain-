# QuantumChain Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the QuantumChain platform in various environments.

## Prerequisites

### Required Software
- Node.js v16 or higher
- npm or yarn
- MongoDB v4.4+
- Git
- MetaMask (for testing)

### Required Accounts
- Infura account (for Ethereum node access)
- MongoDB Atlas account (for cloud database) or local MongoDB
- GitHub account (for repository access)
- Domain name and hosting service (for production)

## Environment Setup

### 1. Development Environment

#### Clone Repository
```bash
git clone https://github.com/Ismael-Njihia/QuantumChain-.git
cd QuantumChain-
```

#### Frontend Setup
```bash
cd frontend
npm install

# Create .env file
cat > .env.local << EOF
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CHAIN_ID=1337
EOF

# Start development server
npm start
```

#### Backend Setup
```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/quantumchain
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRE=7d

ETHEREUM_NETWORK=localhost
INFURA_PROJECT_ID=your_infura_project_id
PRIVATE_KEY=your_private_key

IPFS_HOST=ipfs.infura.io
IPFS_PORT=5001
IPFS_PROTOCOL=https

PRESALE_PRICE=0.0008
MAINSALE_PRICE=0.001
PRESALE_BONUS=25
MAINSALE_BONUS=10
EOF

# Start MongoDB (if local)
mongod --dbpath ./data/db

# Start backend server
npm run dev
```

#### Blockchain Setup
```bash
cd blockchain
npm install

# Start local Hardhat node
npx hardhat node

# In another terminal, deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

### 2. Testnet Deployment (Sepolia)

#### Update Blockchain Configuration
```bash
cd blockchain

# Update .env
cat > .env << EOF
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your_testnet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
EOF

# Compile contracts
npm run compile

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# Verify contracts
npx hardhat verify --network sepolia CONTRACT_ADDRESS CONSTRUCTOR_ARGS
```

#### Update Backend Configuration
```bash
cd backend

# Update .env
ETHEREUM_NETWORK=sepolia
QCN_TOKEN_ADDRESS=deployed_token_address
DEX_CONTRACT_ADDRESS=deployed_dex_address
```

#### Update Frontend Configuration
```bash
cd frontend

# Update .env.local
REACT_APP_API_URL=your_backend_url/api
REACT_APP_CHAIN_ID=11155111
REACT_APP_TOKEN_ADDRESS=deployed_token_address
REACT_APP_DEX_ADDRESS=deployed_dex_address
```

### 3. Production Deployment

#### A. Backend Deployment (AWS EC2 Example)

##### Step 1: Setup EC2 Instance
```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2
sudo npm install -g pm2
```

##### Step 2: Deploy Application
```bash
# Clone repository
git clone https://github.com/Ismael-Njihia/QuantumChain-.git
cd QuantumChain-/backend

# Install dependencies
npm install

# Create production .env
cat > .env << EOF
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/quantumchain
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRE=7d

ETHEREUM_NETWORK=mainnet
INFURA_PROJECT_ID=your_infura_project_id
PRIVATE_KEY=your_private_key

QCN_TOKEN_ADDRESS=deployed_token_address
DEX_CONTRACT_ADDRESS=deployed_dex_address

IPFS_HOST=ipfs.infura.io
IPFS_PORT=5001
IPFS_PROTOCOL=https
EOF

# Start with PM2
pm2 start src/server.js --name quantumchain-backend
pm2 save
pm2 startup
```

##### Step 3: Setup Nginx
```bash
# Install Nginx
sudo apt install -y nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/quantumchain

# Add configuration:
server {
    listen 80;
    server_name api.quantumchain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/quantumchain /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

##### Step 4: Setup SSL
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.quantumchain.com
```

#### B. Frontend Deployment (Vercel Example)

##### Step 1: Build Application
```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Create production .env
cat > .env.production << EOF
REACT_APP_API_URL=https://api.quantumchain.com/api
REACT_APP_CHAIN_ID=1
REACT_APP_TOKEN_ADDRESS=deployed_token_address
REACT_APP_DEX_ADDRESS=deployed_dex_address
EOF

# Build
npm run build
```

##### Step 2: Deploy to Vercel
```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### C. Smart Contract Deployment (Mainnet)

##### Step 1: Prepare for Deployment
```bash
cd blockchain

# Update .env for mainnet
cat > .env << EOF
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your_mainnet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
EOF

# Ensure sufficient ETH for gas
# Recommended: At least 0.5 ETH
```

##### Step 2: Deploy Contracts
```bash
# Test deployment on testnet first!

# Deploy to mainnet
npx hardhat run scripts/deploy.js --network mainnet

# Verify on Etherscan
npx hardhat verify --network mainnet TOKEN_ADDRESS "CONSTRUCTOR_ARGS"
npx hardhat verify --network mainnet DEX_ADDRESS "CONSTRUCTOR_ARGS"
```

##### Step 3: Initial Configuration
```bash
# Connect to contract and configure
# Use Hardhat console or custom script

npx hardhat console --network mainnet

# Example configuration:
const QCNToken = await ethers.getContractFactory("QCNToken");
const token = await QCNToken.attach("TOKEN_ADDRESS");

# Unpause if needed
await token.unpause();

# Setup DEX liquidity, etc.
```

## Post-Deployment Checklist

### Frontend
- [ ] Verify all pages load correctly
- [ ] Test wallet connection
- [ ] Verify API endpoints are accessible
- [ ] Check responsive design on mobile
- [ ] Test all user flows
- [ ] Enable analytics
- [ ] Setup monitoring

### Backend
- [ ] Verify health endpoint: /health
- [ ] Test all API endpoints
- [ ] Check database connection
- [ ] Verify authentication works
- [ ] Test IPFS integration
- [ ] Setup logging
- [ ] Configure monitoring (e.g., Datadog, New Relic)
- [ ] Setup backup strategy

### Blockchain
- [ ] Verify contracts on Etherscan
- [ ] Test token transfers
- [ ] Test DEX functionality
- [ ] Check contract ownership
- [ ] Verify fee settings
- [ ] Setup event monitoring
- [ ] Document contract addresses

### Security
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Setup DDoS protection (e.g., Cloudflare)
- [ ] Configure firewall rules
- [ ] Setup intrusion detection
- [ ] Enable audit logging
- [ ] Schedule security audits

### Monitoring
- [ ] Setup uptime monitoring
- [ ] Configure error tracking
- [ ] Setup performance monitoring
- [ ] Enable transaction monitoring
- [ ] Configure alerts
- [ ] Setup log aggregation
- [ ] Create monitoring dashboard

## Maintenance

### Regular Tasks

#### Daily
- Monitor system health
- Check error logs
- Review transaction volume
- Monitor gas prices

#### Weekly
- Review security logs
- Check backup integrity
- Update dependencies (if needed)
- Review user feedback

#### Monthly
- Security audit
- Performance optimization
- Database optimization
- Cost analysis

### Update Procedure

#### Frontend Updates
```bash
cd frontend
git pull origin main
npm install
npm run build
# Deploy updated build
```

#### Backend Updates
```bash
cd backend
git pull origin main
npm install
pm2 restart quantumchain-backend
```

#### Smart Contract Updates
- Contracts are immutable
- Deploy new versions if needed
- Migrate users to new contracts
- Maintain backwards compatibility

## Rollback Procedure

### Frontend Rollback
```bash
# Revert to previous deployment
vercel rollback
```

### Backend Rollback
```bash
cd backend
git checkout previous-commit
npm install
pm2 restart quantumchain-backend
```

### Database Rollback
```bash
# Restore from backup
mongorestore --db quantumchain /path/to/backup
```

## Troubleshooting

### Common Issues

#### Frontend not connecting to backend
- Check REACT_APP_API_URL in .env
- Verify CORS configuration
- Check network tab in browser DevTools

#### Smart contract transactions failing
- Verify sufficient gas
- Check contract is not paused
- Verify wallet is connected to correct network
- Check for blacklisted addresses

#### Backend 500 errors
- Check logs: `pm2 logs quantumchain-backend`
- Verify MongoDB connection
- Check environment variables
- Verify contract addresses

#### High gas costs
- Optimize contract calls
- Batch transactions
- Use gas price oracles
- Consider Layer 2 solutions

## Support

For deployment support:
- Documentation: /docs
- GitHub Issues
- Email: support@quantumchain.com
- Discord community

## Additional Resources

- [AWS Documentation](https://aws.amazon.com/documentation/)
- [Vercel Documentation](https://vercel.com/docs)
- [Hardhat Documentation](https://hardhat.org/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Infura Documentation](https://docs.infura.io/)
