const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const mockStore = require('../utils/mockStore');
const { protect } = require('../middleware/authMiddleware');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'dabbaroti_super_secret_jwt_key_2026_xyz987', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new customer
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, street, area, city, pincode, landmark } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const emailLower = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email: emailLower });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }

      const addresses = street ? [{
        street,
        area: area || '',
        city: city || 'Mohali',
        pincode: pincode || '',
        landmark: landmark || '',
        isDefault: true
      }] : [];

      const user = await User.create({
        name,
        email: emailLower,
        password,
        phone,
        role: 'customer',
        addresses
      });

      return res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          addresses: user.addresses
        },
        token: generateToken(user._id)
      });
    } else {
      // In-memory fallback
      const exists = mockStore.users.find(u => u.email === emailLower);
      if (exists) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }

      const newId = '6650000000000000' + Math.floor(10000000 + Math.random() * 90000000);
      const addresses = street ? [{
        _id: '6650000000000000' + Math.floor(10000000 + Math.random() * 90000000),
        street,
        area: area || '',
        city: city || 'Mohali',
        pincode: pincode || '',
        landmark: landmark || '',
        isDefault: true
      }] : [];

      const newUser = {
        _id: newId,
        name,
        email: emailLower,
        password: bcrypt.hashSync(password, 10),
        phone,
        role: 'customer',
        addresses,
        createdAt: new Date()
      };

      mockStore.users.push(newUser);

      return res.status(201).json({
        success: true,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          addresses: newUser.addresses
        },
        token: generateToken(newUser._id)
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Registration failed: ' + error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const emailLower = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: emailLower });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            addresses: user.addresses
          },
          token: generateToken(user._id)
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      const user = mockStore.users.find(u => u.email === emailLower);
      if (user && bcrypt.compareSync(password, user.password)) {
        return res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            addresses: user.addresses || []
          },
          token: generateToken(user._id)
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed: ' + error.message });
  }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        addresses: req.user.addresses
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (password) user.password = password;

      const updated = await user.save();
      return res.json({
        success: true,
        user: {
          _id: updated._id,
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          role: updated.role,
          addresses: updated.addresses
        }
      });
    } else {
      const user = mockStore.users.find(u => u._id.toString() === req.user._id.toString());
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (password) user.password = bcrypt.hashSync(password, 10);

      return res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          addresses: user.addresses
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/address
// @desc    Add delivery address
// @access  Private
router.post('/address', protect, async (req, res) => {
  try {
    const { street, area, city, pincode, landmark, isDefault } = req.body;
    if (!street || !pincode) {
      return res.status(400).json({ success: false, message: 'Street and Pincode are required' });
    }

    const newAddr = {
      _id: '6650000000000000' + Math.floor(10000000 + Math.random() * 90000000),
      street,
      area: area || '',
      city: city || 'Mohali',
      pincode,
      landmark: landmark || '',
      isDefault: Boolean(isDefault)
    };

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id);
      if (isDefault) {
        user.addresses.forEach(a => a.isDefault = false);
      }
      user.addresses.push(newAddr);
      await user.save();
      return res.json({ success: true, addresses: user.addresses });
    } else {
      const user = mockStore.users.find(u => u._id.toString() === req.user._id.toString());
      if (isDefault && user.addresses) {
        user.addresses.forEach(a => a.isDefault = false);
      }
      if (!user.addresses) user.addresses = [];
      user.addresses.push(newAddr);
      return res.json({ success: true, addresses: user.addresses });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
