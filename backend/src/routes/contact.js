const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contactController');

router.post('/send', ContactController.sendMessage);
router.post('/subscribe', ContactController.subscribeNewsletter);

module.exports = router;
