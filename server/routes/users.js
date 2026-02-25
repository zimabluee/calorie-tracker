/**
 * @model User
 * @description User schema for MongoDB.
 */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

// Import the User Model
const User = require('../models/User');

// @route    POST api/users
// @desc     Register user
// @access   Public

router.post('/register', async (req, res) => {
    try {
      // 1. DEFINE EMAIL
      const { name, email, password } = req.body; 
  
      // 2. Now you can use it
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      user = new User({ name, email, password });
      
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
  
      const payload = { user: { id: user.id } };
  
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message); 
      res.status(500).send('Server Error');
    }
  });

module.exports = router;