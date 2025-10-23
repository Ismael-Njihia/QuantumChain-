# Deployment Guide for QuantumChain

This guide provides step-by-step instructions for deploying the QuantumChain platform to production.

## Prerequisites

- Node.js 16.x or higher
- MongoDB instance (MongoDB Atlas or self-hosted)
- Domain name with SSL certificate
- SMTP server for email notifications
- Ethereum RPC endpoint (Infura, Alchemy, or self-hosted node)
- GitHub account (for CI/CD)

## Backend Deployment

### 1. Prepare the Backend

```bash
cd backend
npm install --production
```

### 2. Configure Environment Variables

Create a `.env` file with production values:

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quantumchain

# JWT
JWT_SECRET=your-very-long-random-secret-key-min-256-bits
JWT_EXPIRE=24h

# Ethereum Network
ETH_NETWORK=mainnet
ETH_RPC_URL=https://mainnet.infura.io/v3/your-infura-key
QCN_TOKEN_ADDRESS=0x...
DEX_CONTRACT_ADDRESS=0x...
POS_CONTRACT_ADDRESS=0x...

# IPFS
IPFS_HOST=ipfs.infura.io
IPFS_PORT=5001
IPFS_PROTOCOL=https

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@quantumchain.io

# Frontend
FRONTEND_URL=https://quantumchain.io

# Token Sale
PRE_SALE_PRICE=0.01
MAIN_SALE_PRICE=0.02
MIN_PURCHASE=100
MAX_PURCHASE=1000000
```

### 3. Deploy to Production Server

#### Option A: PM2 (Process Manager)

```bash
npm install -g pm2
pm2 start src/server.js --name quantumchain-api
pm2 save
pm2 startup
```

#### Option B: Docker

Create `Dockerfile`:

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]
```

Build and run:

```bash
docker build -t quantumchain-api .
docker run -d -p 5000:5000 --env-file .env --name quantumchain-api quantumchain-api
```

#### Option C: Cloud Platforms

**Heroku:**
```bash
heroku create quantumchain-api
heroku config:set $(cat .env | sed 's/^//')
git push heroku main
```

**AWS Elastic Beanstalk:**
```bash
eb init -p node.js quantumchain-api
eb create quantumchain-api-env
eb deploy
```

### 4. Set Up Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.quantumchain.io;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 5. Enable SSL with Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.quantumchain.io
```

## Frontend Deployment

### 1. Build the Frontend

```bash
cd frontend
npm install
npm run build
```

### 2. Configure Environment Variables

Create `.env.production`:

```env
REACT_APP_API_URL=https://api.quantumchain.io/api
```

Rebuild:
```bash
npm run build
```

### 3. Deploy Static Files

#### Option A: Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

Or use Netlify's GitHub integration for continuous deployment.

#### Option B: Vercel

```bash
npm install -g vercel
vercel --prod
```

#### Option C: AWS S3 + CloudFront

```bash
aws s3 sync build/ s3://quantumchain-frontend --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

#### Option D: Traditional Web Server (Nginx)

```nginx
server {
    listen 80;
    server_name quantumchain.io www.quantumchain.io;
    root /var/www/quantumchain/build;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable SSL:
```bash
sudo certbot --nginx -d quantumchain.io -d www.quantumchain.io
```

## Smart Contracts Deployment

### 1. Install Hardhat or Truffle

```bash
npm install --global hardhat
```

### 2. Create Deployment Script

Create `deploy.js`:

```javascript
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy QCN Token
  const QCNToken = await ethers.getContractFactory("QCNToken");
  const qcnToken = await QCNToken.deploy(1000000000); // 1B tokens
  await qcnToken.deployed();
  console.log("QCN Token deployed to:", qcnToken.address);

  // Deploy QuantumDEX
  const QuantumDEX = await ethers.getContractFactory("QuantumDEX");
  const dex = await QuantumDEX.deploy(qcnToken.address);
  await dex.deployed();
  console.log("QuantumDEX deployed to:", dex.address);

  // Deploy HybridPoSConsensus
  const HybridPoS = await ethers.getContractFactory("HybridPoSConsensus");
  const pos = await HybridPoS.deploy();
  await pos.deployed();
  console.log("HybridPoS deployed to:", pos.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### 3. Deploy to Network

```bash
hardhat run deploy.js --network mainnet
```

### 4. Verify Contracts on Etherscan

```bash
hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS "CONSTRUCTOR_ARGS"
```

## Database Setup

### MongoDB Atlas

1. Create a cluster at https://cloud.mongodb.com
2. Configure network access (whitelist IPs)
3. Create database user
4. Get connection string and update `MONGODB_URI` in `.env`

### Self-Hosted MongoDB

```bash
# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Create database and user
mongo
use quantumchain
db.createUser({
  user: "quantumchain",
  pwd: "strong-password",
  roles: ["readWrite"]
})
```

## Security Checklist

- [ ] All environment variables are set securely
- [ ] JWT_SECRET is at least 256 bits
- [ ] MongoDB is not publicly accessible
- [ ] SSL certificates are installed and auto-renewing
- [ ] Rate limiting is enabled
- [ ] CORS is properly configured
- [ ] Email credentials are secure
- [ ] Smart contracts are audited
- [ ] Regular backups are configured
- [ ] Monitoring and logging are set up
- [ ] Firewall rules are configured

## Monitoring and Logging

### Backend Monitoring

```bash
# Install monitoring tools
npm install -g pm2
pm2 install pm2-logrotate

# View logs
pm2 logs quantumchain-api
```

### Set Up Error Tracking

Consider using services like:
- Sentry for error tracking
- DataDog for infrastructure monitoring
- LogRocket for frontend monitoring

## Backup Strategy

### Database Backups

```bash
# Daily MongoDB backup
0 2 * * * mongodump --uri="$MONGODB_URI" --out=/backups/$(date +\%Y\%m\%d)
```

### Code Backups

Use Git and maintain multiple remotes:
```bash
git remote add backup https://gitlab.com/yourusername/quantumchain.git
git push backup main
```

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/quantumchain/backend
            git pull
            npm install --production
            pm2 restart quantumchain-api

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and deploy
        run: |
          cd frontend
          npm install
          npm run build
          # Deploy to CDN or web server
```

## Post-Deployment

1. Test all endpoints
2. Verify smart contracts on Etherscan
3. Test user registration and login
4. Test token purchase flow
5. Test DEX functionality
6. Test staking functionality
7. Monitor error logs
8. Set up uptime monitoring (e.g., UptimeRobot)

## Maintenance

- Regularly update dependencies
- Monitor security advisories
- Review logs daily
- Test backup restoration monthly
- Update SSL certificates (automated with Let's Encrypt)
- Review and optimize database queries
- Monitor server resources

## Support

For deployment support:
- Email: devops@quantumchain.io
- Documentation: https://docs.quantumchain.io
- Discord: https://discord.gg/quantumchain
