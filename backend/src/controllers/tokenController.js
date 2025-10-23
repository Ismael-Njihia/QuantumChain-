const { ethers } = require('ethers');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const config = require('../config/config');

class TokenController {
  static async purchaseTokens(req, res) {
    try {
      const { amount, paymentMethod } = req.body;
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Validate amount
      const tokenAmount = parseFloat(amount);
      if (isNaN(tokenAmount) || tokenAmount < parseFloat(config.MIN_PURCHASE)) {
        return res.status(400).json({ 
          error: `Minimum purchase amount is ${config.MIN_PURCHASE} QCN` 
        });
      }

      if (tokenAmount > parseFloat(config.MAX_PURCHASE)) {
        return res.status(400).json({ 
          error: `Maximum purchase amount is ${config.MAX_PURCHASE} QCN` 
        });
      }

      // Calculate price (simplified - in production, check sale phase)
      const pricePerToken = parseFloat(config.MAIN_SALE_PRICE);
      const totalCost = tokenAmount * pricePerToken;

      // Create transaction record
      const transaction = new Transaction({
        user: user._id,
        type: 'purchase',
        amount: tokenAmount,
        tokenSymbol: 'QCN',
        status: 'pending'
      });

      await transaction.save();

      // In production, integrate with payment gateway and blockchain
      // For now, simulate successful purchase
      user.tokenBalance += tokenAmount;
      await user.save();

      transaction.status = 'completed';
      await transaction.save();

      res.json({
        message: 'Token purchase successful',
        transaction: {
          id: transaction._id,
          amount: tokenAmount,
          cost: totalCost,
          status: transaction.status
        },
        newBalance: user.tokenBalance
      });
    } catch (error) {
      console.error('Purchase tokens error:', error);
      res.status(500).json({ error: 'Token purchase failed' });
    }
  }

  static async getBalance(req, res) {
    try {
      const user = await User.findById(req.userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        balance: user.tokenBalance,
        stakedAmount: user.stakedAmount,
        walletAddress: user.walletAddress
      });
    } catch (error) {
      console.error('Get balance error:', error);
      res.status(500).json({ error: 'Failed to get balance' });
    }
  }

  static async transferTokens(req, res) {
    try {
      const { toAddress, amount } = req.body;
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const transferAmount = parseFloat(amount);
      if (isNaN(transferAmount) || transferAmount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      if (user.tokenBalance < transferAmount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      // Validate Ethereum address format and ensure it's a string
      if (typeof toAddress !== 'string') {
        return res.status(400).json({ error: 'Invalid wallet address' });
      }
      
      const addressRegex = /^0x[a-fA-F0-9]{40}$/;
      if (!addressRegex.test(toAddress)) {
        return res.status(400).json({ error: 'Invalid wallet address' });
      }

      // Create transaction record
      const transaction = new Transaction({
        user: user._id,
        type: 'transfer',
        amount: transferAmount,
        tokenSymbol: 'QCN',
        fromAddress: user.walletAddress,
        toAddress: String(toAddress).toLowerCase(), // Normalize to lowercase
        status: 'pending'
      });

      await transaction.save();

      // Update balances (simplified - in production, use smart contracts)
      user.tokenBalance -= transferAmount;
      await user.save();

      // Update recipient if they exist - use exact match with normalized address
      const normalizedAddress = String(toAddress).toLowerCase();
      const recipient = await User.findOne({ 
        walletAddress: { $eq: normalizedAddress } // Use $eq operator for exact match
      });
      if (recipient) {
        recipient.tokenBalance += transferAmount;
        await recipient.save();
      }

      transaction.status = 'completed';
      await transaction.save();

      res.json({
        message: 'Transfer successful',
        transaction: {
          id: transaction._id,
          amount: transferAmount,
          toAddress,
          status: transaction.status
        },
        newBalance: user.tokenBalance
      });
    } catch (error) {
      console.error('Transfer tokens error:', error);
      res.status(500).json({ error: 'Transfer failed' });
    }
  }

  static async getTransactions(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      
      const transactions = await Transaction.find({ user: req.userId })
        .sort({ timestamp: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));

      const total = await Transaction.countDocuments({ user: req.userId });

      res.json({
        transactions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Get transactions error:', error);
      res.status(500).json({ error: 'Failed to get transactions' });
    }
  }

  static async stakeTokens(req, res) {
    try {
      const { amount } = req.body;
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const stakeAmount = parseFloat(amount);
      if (isNaN(stakeAmount) || stakeAmount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      if (user.tokenBalance < stakeAmount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      // Create transaction record
      const transaction = new Transaction({
        user: user._id,
        type: 'stake',
        amount: stakeAmount,
        tokenSymbol: 'QCN',
        status: 'completed'
      });

      await transaction.save();

      // Update balances
      user.tokenBalance -= stakeAmount;
      user.stakedAmount += stakeAmount;
      await user.save();

      res.json({
        message: 'Tokens staked successfully',
        stakedAmount: user.stakedAmount,
        availableBalance: user.tokenBalance
      });
    } catch (error) {
      console.error('Stake tokens error:', error);
      res.status(500).json({ error: 'Staking failed' });
    }
  }

  static async unstakeTokens(req, res) {
    try {
      const { amount } = req.body;
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const unstakeAmount = parseFloat(amount);
      if (isNaN(unstakeAmount) || unstakeAmount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      if (user.stakedAmount < unstakeAmount) {
        return res.status(400).json({ error: 'Insufficient staked amount' });
      }

      // Create transaction record
      const transaction = new Transaction({
        user: user._id,
        type: 'unstake',
        amount: unstakeAmount,
        tokenSymbol: 'QCN',
        status: 'completed'
      });

      await transaction.save();

      // Update balances
      user.stakedAmount -= unstakeAmount;
      user.tokenBalance += unstakeAmount;
      await user.save();

      res.json({
        message: 'Tokens unstaked successfully',
        stakedAmount: user.stakedAmount,
        availableBalance: user.tokenBalance
      });
    } catch (error) {
      console.error('Unstake tokens error:', error);
      res.status(500).json({ error: 'Unstaking failed' });
    }
  }
}

module.exports = TokenController;
