const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Public routes with rate limiting
router.post('/register', authLimiter, AuthController.validate('register'), AuthController.register);
router.post('/login', authLimiter, AuthController.validate('login'), AuthController.login);

// Protected routes
router.get('/profile', auth, AuthController.getProfile);
router.put('/wallet', auth, AuthController.updateWallet);

module.exports = router;
