const express = require('express');
const router = express.Router();
const TokenController = require('../controllers/tokenController');
const { auth } = require('../middleware/auth');

// All routes require authentication
router.post('/purchase', auth, TokenController.purchaseTokens);
router.get('/balance', auth, TokenController.getBalance);
router.post('/transfer', auth, TokenController.transferTokens);
router.get('/transactions', auth, TokenController.getTransactions);
router.post('/stake', auth, TokenController.stakeTokens);
router.post('/unstake', auth, TokenController.unstakeTokens);

module.exports = router;
