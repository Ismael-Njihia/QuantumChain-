const Transaction = require('../models/Transaction');
const User = require('../models/User');
const config = require('../config');
const blockchainService = require('../services/blockchainService');

// Get token price
exports.getTokenPrice = async (req, res) => {
  try {
    const { phase = 'pre-sale' } = req.query;
    
    const price = phase === 'pre-sale' 
      ? config.tokenSale.presalePrice 
      : config.tokenSale.mainsalePrice;
    
    const bonus = phase === 'pre-sale' 
      ? config.tokenSale.presaleBonus 
      : config.tokenSale.mainsaleBonus;

    res.json({
      success: true,
      data: {
        phase,
        price,
        bonus,
        currency: 'ETH',
      },
    });
  } catch (error) {
    console.error('Get token price error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Purchase tokens
exports.purchaseTokens = async (req, res) => {
  try {
    const { amount, phase = 'pre-sale' } = req.body;
    const userId = req.user.userId;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: { message: 'Invalid amount' } });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    // Calculate price and bonus
    const price = phase === 'pre-sale' 
      ? config.tokenSale.presalePrice 
      : config.tokenSale.mainsalePrice;
    
    const bonus = phase === 'pre-sale' 
      ? config.tokenSale.presaleBonus 
      : config.tokenSale.mainsaleBonus;

    const baseTokens = parseFloat(amount);
    const bonusTokens = (baseTokens * bonus) / 100;
    const totalTokens = baseTokens + bonusTokens;
    const totalCost = baseTokens * price;

    // In production, verify payment transaction on blockchain
    // For now, simulate transaction
    const txHash = '0x' + Math.random().toString(16).substr(2, 64);

    // Create transaction record
    const transaction = new Transaction({
      from: user.walletAddress,
      to: config.contracts.qcnToken || '0x0000000000000000000000000000000000000000',
      amount: totalTokens,
      transactionHash: txHash,
      type: 'purchase',
      status: 'confirmed',
    });

    await transaction.save();

    // Update user balance
    user.tokenBalance += totalTokens;
    await user.save();

    res.json({
      success: true,
      data: {
        transaction: {
          hash: txHash,
          baseTokens,
          bonusTokens,
          totalTokens,
          costInETH: totalCost,
        },
        newBalance: user.tokenBalance,
      },
    });
  } catch (error) {
    console.error('Purchase tokens error:', error);
    res.status(500).json({ error: { message: 'Server error during purchase' } });
  }
};

// Get token balance
exports.getBalance = async (req, res) => {
  try {
    const { address } = req.params;

    // Get balance from blockchain
    let balance = 0;
    
    if (config.contracts.qcnToken) {
      balance = await blockchainService.getTokenBalance(
        config.contracts.qcnToken,
        address
      );
    } else {
      // Fallback to database balance
      const user = await User.findOne({ walletAddress: address });
      if (user) {
        balance = user.tokenBalance;
      }
    }

    res.json({
      success: true,
      data: {
        address,
        balance,
        symbol: 'QCN',
      },
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Transfer tokens
exports.transferTokens = async (req, res) => {
  try {
    const { to, amount } = req.body;
    const userId = req.user.userId;

    // Validate inputs
    if (!to || typeof to !== 'string' || !to.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({ error: { message: 'Invalid recipient address' } });
    }
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: { message: 'Invalid amount' } });
    }

    // Get sender
    const sender = await User.findById(userId);
    if (!sender) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    // Check balance
    if (sender.tokenBalance < amount) {
      return res.status(400).json({ error: { message: 'Insufficient balance' } });
    }

    // Simulate transaction
    const txHash = '0x' + Math.random().toString(16).substr(2, 64);

    // Create transaction record
    const transaction = new Transaction({
      from: sender.walletAddress,
      to,
      amount,
      transactionHash: txHash,
      type: 'transfer',
      status: 'confirmed',
    });

    await transaction.save();

    // Update sender balance
    sender.tokenBalance -= amount;
    await sender.save();

    // Update receiver balance if exists - sanitize the address
    const sanitizedAddress = to.toLowerCase();
    const receiver = await User.findOne({ walletAddress: sanitizedAddress });
    if (receiver) {
      receiver.tokenBalance += amount;
      await receiver.save();
    }

    res.json({
      success: true,
      data: {
        transaction: {
          hash: txHash,
          from: sender.walletAddress,
          to,
          amount,
        },
        newBalance: sender.tokenBalance,
      },
    });
  } catch (error) {
    console.error('Transfer tokens error:', error);
    res.status(500).json({ error: { message: 'Server error during transfer' } });
  }
};
