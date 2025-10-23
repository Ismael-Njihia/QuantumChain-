const Order = require('../models/Order');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { orderType, tokenPair, amount, price } = req.body;
    const userId = req.user.userId;

    if (!orderType || !amount || !price) {
      return res.status(400).json({ error: { message: 'Missing required fields' } });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    // Validate balance for sell orders
    if (orderType === 'sell' && user.tokenBalance < amount) {
      return res.status(400).json({ error: { message: 'Insufficient token balance' } });
    }

    // Create order
    const order = new Order({
      user: userId,
      walletAddress: user.walletAddress,
      orderType,
      tokenPair: tokenPair || 'QCN/ETH',
      amount,
      price,
      status: 'open',
    });

    await order.save();

    // Lock tokens for sell orders
    if (orderType === 'sell') {
      user.tokenBalance -= amount;
      await user.save();
    }

    res.status(201).json({
      success: true,
      data: { order },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: { message: 'Server error creating order' } });
  }
};

// Get orders
exports.getOrders = async (req, res) => {
  try {
    const { status, orderType } = req.query;
    const userId = req.user.userId;

    const filter = { user: userId };
    if (status) filter.status = status;
    if (orderType) filter.orderType = orderType;

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { orders },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Get all open orders (order book)
exports.getOrderBook = async (req, res) => {
  try {
    const { tokenPair = 'QCN/ETH' } = req.query;

    const buyOrders = await Order.find({
      tokenPair,
      orderType: 'buy',
      status: 'open',
    }).sort({ price: -1 }).limit(20);

    const sellOrders = await Order.find({
      tokenPair,
      orderType: 'sell',
      status: 'open',
    }).sort({ price: 1 }).limit(20);

    res.json({
      success: true,
      data: {
        tokenPair,
        buyOrders,
        sellOrders,
      },
    });
  } catch (error) {
    console.error('Get order book error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};

// Execute order (match orders)
exports.executeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: { message: 'Order not found' } });
    }

    if (order.status !== 'open') {
      return res.status(400).json({ error: { message: 'Order is not open' } });
    }

    // Get executor user
    const executor = await User.findById(userId);
    if (!executor) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    // Get order owner
    const owner = await User.findById(order.user);
    if (!owner) {
      return res.status(404).json({ error: { message: 'Order owner not found' } });
    }

    // Validate and execute based on order type
    if (order.orderType === 'sell') {
      // Executor is buying, needs ETH balance (simulated here)
      // Transfer tokens from order to executor
      executor.tokenBalance += order.amount;
      await executor.save();

      // Owner gets ETH (simulated)
      // In production, actual blockchain transaction would occur
    } else {
      // Executor is selling, needs token balance
      if (executor.tokenBalance < order.amount) {
        return res.status(400).json({ error: { message: 'Insufficient balance' } });
      }

      executor.tokenBalance -= order.amount;
      await executor.save();

      owner.tokenBalance += order.amount;
      await owner.save();
    }

    // Update order status
    order.status = 'filled';
    order.filledAmount = order.amount;
    order.updatedAt = new Date();
    
    // Generate transaction hash
    const txHash = '0x' + Math.random().toString(16).substr(2, 64);
    order.transactionHash = txHash;
    
    await order.save();

    // Create transaction record
    const transaction = new Transaction({
      from: order.orderType === 'sell' ? owner.walletAddress : executor.walletAddress,
      to: order.orderType === 'sell' ? executor.walletAddress : owner.walletAddress,
      amount: order.amount,
      transactionHash: txHash,
      type: 'trade',
      status: 'confirmed',
    });

    await transaction.save();

    res.json({
      success: true,
      data: {
        order,
        transaction: {
          hash: txHash,
          amount: order.amount,
          price: order.price,
        },
      },
    });
  } catch (error) {
    console.error('Execute order error:', error);
    res.status(500).json({ error: { message: 'Server error executing order' } });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({ error: { message: 'Order not found' } });
    }

    if (order.status !== 'open') {
      return res.status(400).json({ error: { message: 'Can only cancel open orders' } });
    }

    // Return locked tokens for sell orders
    if (order.orderType === 'sell') {
      const user = await User.findById(userId);
      user.tokenBalance += order.amount - order.filledAmount;
      await user.save();
    }

    order.status = 'cancelled';
    order.updatedAt = new Date();
    await order.save();

    res.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
};
