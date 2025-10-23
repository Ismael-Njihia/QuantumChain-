const express = require('express');
const router = express.Router();
const ipfsController = require('../controllers/ipfsController');
const auth = require('../middleware/auth');

// IPFS routes require authentication
router.post('/upload', auth, ipfsController.uploadFile);
router.get('/file/:hash', ipfsController.getFile);

module.exports = router;
