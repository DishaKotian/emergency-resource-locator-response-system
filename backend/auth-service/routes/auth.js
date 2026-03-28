const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      console.log('[Auth] Missing email or password');
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('[Auth] Duplicate email:', email);
      return res.status(400).json({ error: 'An account with this email already exists. Please log in instead.' });
    }
    const user = new User({ email, password });
    await user.save();
    console.log('[Auth] User registered:', email);
    res.status(201).json({ message: 'Account created successfully! You can now log in.' });
  } catch (err) {
    console.error('[Auth] Register error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('[Auth] JWT_SECRET not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '1d' });
    res.json({ token, user: { email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/all-users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
