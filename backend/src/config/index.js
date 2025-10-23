require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/quantumchain',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  
  ethereum: {
    network: process.env.ETHEREUM_NETWORK || 'sepolia',
    infuraProjectId: process.env.INFURA_PROJECT_ID,
    privateKey: process.env.PRIVATE_KEY,
  },
  
  ipfs: {
    host: process.env.IPFS_HOST || 'ipfs.infura.io',
    port: process.env.IPFS_PORT || 5001,
    protocol: process.env.IPFS_PROTOCOL || 'https',
  },
  
  tokenSale: {
    presalePrice: parseFloat(process.env.PRESALE_PRICE) || 0.0008,
    mainsalePrice: parseFloat(process.env.MAINSALE_PRICE) || 0.001,
    presaleBonus: parseInt(process.env.PRESALE_BONUS) || 25,
    mainsaleBonus: parseInt(process.env.MAINSALE_BONUS) || 10,
  },
  
  contracts: {
    qcnToken: process.env.QCN_TOKEN_ADDRESS,
    dexContract: process.env.DEX_CONTRACT_ADDRESS,
  },
};
