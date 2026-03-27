/**
 * @file auth.js
 * @description: Middleware to check the JWT tokens.
 */

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Look for the 'Authorization' header
  const authHeader = req.header('Authorization');
  // Check if header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = 
    req.header('x-auth-token') || 
    req.header('Authorization')?.split(' ')[1]; // This looks for "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    //3. Verify token 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //4. Attach user data to the request object
    req.user = { id: decoded.userId }; 
    next(); // Pass to the next route
  } catch (err) {
    //Redirect to login
    res.status(401).json({ message: 'Token is not valid' });
  }
};