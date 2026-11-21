const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Subscription = require('../models/Subscription');
const mockStore = require('../utils/mockStore');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   GET /api/subscriptions/my-subscriptions
// @desc    Get customer's subscriptions
// @access  Private
router.get('/my-subscriptions', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const subs = await Subscription.find({ user: req.user._id }).sort({ createdAt: -1 });
      return res.json({ success: true, count: subs.length, data: subs });
    } else {
      const subs = mockStore.subscriptions.filter(s => s.user.toString() === req.user._id.toString());
      return res.json({ success: true, count: subs.length, data: subs });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/subscriptions/:id/pause
// @desc    Customer pause subscription
// @access  Private
router.put('/:id/pause', protect, async (req, res) => {
  try {
    const { pausedFrom, pausedUntil, reason } = req.body;

    if (mongoose.connection.readyState === 1) {
      const sub = await Subscription.findOne({ _id: req.params.id, user: req.user._id });
      if (!sub) return res.status(404).json({ success: false, message: 'Subscription not found' });

      sub.status = 'paused';
      sub.pauseHistory.push({
        pausedFrom: pausedFrom ? new Date(pausedFrom) : new Date(),
        pausedUntil: pausedUntil ? new Date(pausedUntil) : new Date(Date.now() + 3*24*60*60*1000),
        reason: reason || 'Customer requested temporary pause'
      });

      const updated = await sub.save();
      return res.json({ success: true, message: 'Subscription paused successfully', data: updated });
    } else {
      const sub = mockStore.subscriptions.find(s => s._id.toString() === req.params.id && s.user.toString() === req.user._id.toString());
      if (!sub) return res.status(404).json({ success: false, message: 'Subscription not found' });

      sub.status = 'paused';
      if (!sub.pauseHistory) sub.pauseHistory = [];
      sub.pauseHistory.push({
        pausedFrom: pausedFrom ? new Date(pausedFrom) : new Date(),
        pausedUntil: pausedUntil ? new Date(pausedUntil) : new Date(Date.now() + 3*24*60*60*1000),
        reason: reason || 'Customer requested temporary pause'
      });

      return res.json({ success: true, message: 'Subscription paused successfully', data: sub });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/subscriptions/:id/resume
// @desc    Customer resume subscription
// @access  Private
router.put('/:id/resume', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const sub = await Subscription.findOne({ _id: req.params.id, user: req.user._id });
      if (!sub) return res.status(404).json({ success: false, message: 'Subscription not found' });

      sub.status = 'active';
      const updated = await sub.save();
      return res.json({ success: true, message: 'Subscription resumed successfully', data: updated });
    } else {
      const sub = mockStore.subscriptions.find(s => s._id.toString() === req.params.id && s.user.toString() === req.user._id.toString());
      if (!sub) return res.status(404).json({ success: false, message: 'Subscription not found' });

      sub.status = 'active';
      return res.json({ success: true, message: 'Subscription resumed successfully', data: sub });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/subscriptions/:id/cancel
// @desc    Customer cancel subscription
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const sub = await Subscription.findOne({ _id: req.params.id, user: req.user._id });
      if (!sub) return res.status(404).json({ success: false, message: 'Subscription not found' });

      sub.status = 'cancelled';
      const updated = await sub.save();
      return res.json({ success: true, message: 'Subscription cancelled', data: updated });
    } else {
      const sub = mockStore.subscriptions.find(s => s._id.toString() === req.params.id && s.user.toString() === req.user._id.toString());
      if (!sub) return res.status(404).json({ success: false, message: 'Subscription not found' });

      sub.status = 'cancelled';
      return res.json({ success: true, message: 'Subscription cancelled', data: sub });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/subscriptions
// @desc    Admin get all subscriptions
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const subs = await Subscription.find().populate('user', 'name email phone').sort({ createdAt: -1 });
      return res.json({ success: true, count: subs.length, data: subs });
    } else {
      return res.json({ success: true, count: mockStore.subscriptions.length, data: mockStore.subscriptions });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
