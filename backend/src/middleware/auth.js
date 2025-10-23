const jwt = require('jsonwebtoken');
const config = require('../config');

const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: { message: 'No token, authorization denied' } });
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: { message: 'Token is not valid' } });
  }
};

module.exports = auth;
