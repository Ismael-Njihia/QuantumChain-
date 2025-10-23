const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Public routes
router.post('/register', AuthController.validate('register'), AuthController.register);
router.post('/login', AuthController.validate('login'), AuthController.login);

// Protected routes
router.get('/profile', auth, AuthController.getProfile);
router.put('/wallet', auth, AuthController.updateWallet);

module.exports = router;
