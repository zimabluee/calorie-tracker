const User = require('../models/User');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      email,
      password: hashedPassword 
    });

    await user.save();

    // Generate token so they are logged in immediately
    const payload = { userId: user.id, email: user.email }; 
    const token = jwt.sign(
      payload, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.status(201).json({ 
      token, 
      message: 'User registered successfully!',
      email: user.email 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Email for the frontend to display
    const payload = { userId: user.id, email: user.email }; 
    const token = jwt.sign(
      payload, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ token, message: "Logged in successfully!" });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;