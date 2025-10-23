const express = require('express');
const router = express.Router();
const dexController = require('../controllers/dexController');
const auth = require('../middleware/auth');

// All DEX routes require authentication
router.post('/orders', auth, dexController.createOrder);
router.get('/orders', auth, dexController.getOrders);
router.get('/orderbook', auth, dexController.getOrderBook);
router.post('/orders/:orderId/execute', auth, dexController.executeOrder);
router.delete('/orders/:orderId', auth, dexController.cancelOrder);

module.exports = router;
