const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const config = require('../config/config');
const PostQuantumCrypto = require('../utils/postQuantumCrypto');

class AuthController {
  static validate(method) {
    switch (method) {
      case 'register':
        return [
          body('email').isEmail().normalizeEmail(),
          body('password').isLength({ min: 8 }),
          body('username').isLength({ min: 3 }).trim()
        ];
      case 'login':
        return [
          body('email').isEmail().normalizeEmail(),
          body('password').exists()
        ];
      default:
        return [];
    }
  }

  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, username } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate post-quantum key pair
      const quantumKeyPair = PostQuantumCrypto.generateKeyPair();

      // Create user
      const user = new User({
        email,
        password: hashedPassword,
        username,
        quantumKeyPair: {
          publicKey: quantumKeyPair.publicKey,
          privateKey: quantumKeyPair.privateKey, // Should be encrypted in production
          algorithm: quantumKeyPair.algorithm
        }
      });

      await user.save();

      // Generate JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRE }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          quantumPublicKey: quantumKeyPair.publicKey
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRE }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          walletAddress: user.walletAddress,
          tokenBalance: user.tokenBalance,
          stakedAmount: user.stakedAmount
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.userId).select('-password -quantumKeyPair.privateKey');
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to get profile' });
    }
  }

  static async updateWallet(req, res) {
    try {
      const { walletAddress } = req.body;

      if (!walletAddress) {
        return res.status(400).json({ error: 'Wallet address required' });
      }

      const user = await User.findById(req.userId);
      user.walletAddress = walletAddress;
      await user.save();

      res.json({
        message: 'Wallet address updated',
        walletAddress: user.walletAddress
      });
    } catch (error) {
      console.error('Update wallet error:', error);
      res.status(500).json({ error: 'Failed to update wallet' });
    }
  }
}

module.exports = AuthController;
