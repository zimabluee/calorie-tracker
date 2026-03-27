/**
 * @file auth.js
 * @description: Middleware to check the JWT tokens.
 */

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Try to get token from multiple sources
  const xAuthToken = req.header('x-auth-token');
  const authHeader = req.header('Authorization');
  
  let token;

  if (xAuthToken) {
    token = xAuthToken;
  } else if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // 2. If no token found in either place, THEN deny
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Use decoded.userId to match your JWT payload
    req.user = { id: decoded.userId }; 
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};