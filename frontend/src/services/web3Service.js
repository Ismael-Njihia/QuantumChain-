import { ethers } from 'ethers';

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.account = null;
  }

  async connectWallet() {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask or another Web3 wallet');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.account = accounts[0];

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          this.account = accounts[0];
          window.location.reload();
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      return this.account;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  async getBalance(address) {
    try {
      if (!this.provider) {
        await this.connectWallet();
      }
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  async getNetwork() {
    try {
      if (!this.provider) {
        await this.connectWallet();
      }
      const network = await this.provider.getNetwork();
      return network;
    } catch (error) {
      console.error('Error getting network:', error);
      throw error;
    }
  }

  async sendTransaction(to, amount) {
    try {
      if (!this.signer) {
        await this.connectWallet();
      }

      const tx = await this.signer.sendTransaction({
        to,
        value: ethers.parseEther(amount),
      });

      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  isConnected() {
    return this.account !== null;
  }

  getAccount() {
    return this.account;
  }

  disconnectWallet() {
    this.provider = null;
    this.signer = null;
    this.account = null;
  }
}

export default new Web3Service();
