const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');
const blockchainService = require('../services/blockchainService');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

// Register user
exports.register = async (req, res) => {
  try {
    const { email, password, anonymousWallet = true } = req.body;

    // Validate input
    if (!email || typeof email !== 'string' || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ error: { message: 'Invalid email format' } });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: { message: 'Password must be at least 6 characters' } });
    }

    // Check if user exists - sanitize email
    const sanitizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: { message: 'User already exists' } });
    }

    // Generate quantum-resistant wallet
    const walletData = await blockchainService.generateQuantumResistantKeyPair();

    // Create user
    const user = new User({
      email: sanitizedEmail,
      password,
      walletAddress: walletData.address,
      anonymousWallet,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          walletAddress: user.walletAddress,
          anonymousWallet: user.anonymousWallet,
        },
        walletInfo: {
          address: walletData.address,
          // Note: In production, never send private key or mnemonic to client
          // Store encrypted in secure storage
          privateKey: walletData.privateKey,
          mnemonic: walletData.mnemonic,
          quantumResistant: walletData.quantumResistant,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: { message: 'Server error during registration' } });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return res.status(400).json({ error: { message: 'Invalid credentials' } });
    }

    // Find user - sanitize email
    const sanitizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: sanitizedEmail });
    if (!user) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          walletAddress: user.walletAddress,
          tokenBalance: user.tokenBalance,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: { message: 'Server error during login' } });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};
