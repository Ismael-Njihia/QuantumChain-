const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');
const auth = require('../middleware/auth');

// Public routes
router.get('/price', tokenController.getTokenPrice);

// Protected routes
router.post('/purchase', auth, tokenController.purchaseTokens);
router.get('/balance/:address', auth, tokenController.getBalance);
router.post('/transfer', auth, tokenController.transferTokens);

module.exports = router;
