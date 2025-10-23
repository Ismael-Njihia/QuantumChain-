const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  walletAddress: {
    type: String,
    unique: true,
    sparse: true
  },
  kycVerified: {
    type: Boolean,
    default: false
  },
  quantumKeyPair: {
    publicKey: String,
    privateKey: String, // Encrypted
    algorithm: String
  },
  tokenBalance: {
    type: Number,
    default: 0
  },
  stakedAmount: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

module.exports = mongoose.model('User', UserSchema);
