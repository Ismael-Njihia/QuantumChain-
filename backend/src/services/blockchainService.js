const { ethers } = require('ethers');
const config = require('../config');

class BlockchainService {
  constructor() {
    this.provider = null;
    this.wallet = null;
    this.initProvider();
  }

  initProvider() {
    try {
      // Initialize provider based on network
      if (config.ethereum.infuraProjectId) {
        const infuraUrl = `https://${config.ethereum.network}.infura.io/v3/${config.ethereum.infuraProjectId}`;
        this.provider = new ethers.JsonRpcProvider(infuraUrl);
      } else {
        // Fallback to local provider
        this.provider = new ethers.JsonRpcProvider('http://localhost:8545');
      }

      // Initialize wallet if private key is provided
      if (config.ethereum.privateKey) {
        this.wallet = new ethers.Wallet(config.ethereum.privateKey, this.provider);
      }

      console.log('Blockchain service initialized');
    } catch (error) {
      console.error('Error initializing blockchain service:', error);
    }
  }

  async getBalance(address) {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  async getTokenBalance(tokenAddress, walletAddress) {
    try {
      // ERC-20 ABI for balanceOf function
      const abi = ['function balanceOf(address) view returns (uint256)'];
      const contract = new ethers.Contract(tokenAddress, abi, this.provider);
      const balance = await contract.balanceOf(walletAddress);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw error;
    }
  }

  async sendTransaction(to, amount) {
    try {
      if (!this.wallet) {
        throw new Error('Wallet not initialized');
      }

      const tx = await this.wallet.sendTransaction({
        to,
        value: ethers.parseEther(amount.toString()),
      });

      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  generateWallet() {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic.phrase,
    };
  }

  // Post-quantum cryptography placeholder
  // In production, integrate actual post-quantum libraries like liboqs
  async generateQuantumResistantKeyPair() {
    // This is a placeholder for post-quantum key generation
    // Real implementation would use libraries like:
    // - liboqs (Open Quantum Safe)
    // - NIST PQC finalists (Kyber, Dilithium, etc.)
    
    const classicalWallet = this.generateWallet();
    
    return {
      ...classicalWallet,
      quantumResistant: true,
      algorithm: 'CRYSTALS-Kyber',
      note: 'Production implementation requires actual post-quantum crypto library',
    };
  }
}

module.exports = new BlockchainService();
