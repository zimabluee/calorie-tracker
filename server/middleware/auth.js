/**
 * @file auth.js
 * @description: Middleware to check the JWT tokens.
 */

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Extract token from custom header
  const token = req.header('x-auth-token');
  // 2. Reject if no token is present
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