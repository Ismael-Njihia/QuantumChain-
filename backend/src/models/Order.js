const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  walletAddress: {
    type: String,
    required: true,
  },
  orderType: {
    type: String,
    enum: ['buy', 'sell'],
    required: true,
  },
  tokenPair: {
    type: String,
    required: true,
    default: 'QCN/ETH',
  },
  amount: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'filled', 'cancelled', 'partial'],
    default: 'open',
  },
  filledAmount: {
    type: Number,
    default: 0,
  },
  transactionHash: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
