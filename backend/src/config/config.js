require('dotenv').config();

module.exports = {
  // Server configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/quantumchain',
  
  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET || 'quantum-chain-secret-key-change-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '24h',
  
  // Ethereum configuration
  ETH_NETWORK: process.env.ETH_NETWORK || 'goerli',
  ETH_RPC_URL: process.env.ETH_RPC_URL || 'https://goerli.infura.io/v3/your-infura-key',
  QCN_TOKEN_ADDRESS: process.env.QCN_TOKEN_ADDRESS || '',
  DEX_CONTRACT_ADDRESS: process.env.DEX_CONTRACT_ADDRESS || '',
  POS_CONTRACT_ADDRESS: process.env.POS_CONTRACT_ADDRESS || '',
  
  // IPFS configuration
  IPFS_HOST: process.env.IPFS_HOST || 'ipfs.infura.io',
  IPFS_PORT: process.env.IPFS_PORT || 5001,
  IPFS_PROTOCOL: process.env.IPFS_PROTOCOL || 'https',
  
  // Email configuration
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@quantumchain.io',
  
  // Frontend URL
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Token sale configuration
  PRE_SALE_PRICE: process.env.PRE_SALE_PRICE || '0.01', // ETH per QCN
  MAIN_SALE_PRICE: process.env.MAIN_SALE_PRICE || '0.02', // ETH per QCN
  MIN_PURCHASE: process.env.MIN_PURCHASE || '100', // Minimum QCN tokens
  MAX_PURCHASE: process.env.MAX_PURCHASE || '1000000', // Maximum QCN tokens
};
