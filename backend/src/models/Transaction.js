const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['purchase', 'transfer', 'trade', 'stake', 'unstake', 'reward'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  tokenSymbol: {
    type: String,
    default: 'QCN'
  },
  txHash: {
    type: String,
    unique: true,
    sparse: true
  },
  fromAddress: String,
  toAddress: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  blockNumber: Number,
  gasUsed: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
