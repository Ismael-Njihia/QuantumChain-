const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contactController');
const { contactLimiter } = require('../middleware/rateLimiter');

router.post('/send', contactLimiter, ContactController.sendMessage);
router.post('/subscribe', contactLimiter, ContactController.subscribeNewsletter);

module.exports = router;
