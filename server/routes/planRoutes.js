const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const TiffinPlan = require('../models/TiffinPlan');
const mockStore = require('../utils/mockStore');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   GET /api/plans
// @desc    Get all active tiffin plans (weekly, monthly)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    if (mongoose.connection.readyState === 1) {
      const filter = { isActive: true };
      if (type) filter.type = type;
      const plans = await TiffinPlan.find(filter).sort({ price: 1 });
      return res.json({ success: true, count: plans.length, data: plans });
    } else {
      let plans = mockStore.plans.filter(p => p.isActive);
      if (type) plans = plans.filter(p => p.type === type);
      return res.json({ success: true, count: plans.length, data: plans });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/plans/:id
// @desc    Get single tiffin plan
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const plan = await TiffinPlan.findById(req.params.id);
      if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
      return res.json({ success: true, data: plan });
    } else {
      const plan = mockStore.plans.find(p => p._id.toString() === req.params.id);
      if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
      return res.json({ success: true, data: plan });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/plans
// @desc    Create a new plan (Admin)
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, type, mealsPerDay, price, durationDays, description, features, includedMeals, image, badge } = req.body;
    
    if (mongoose.connection.readyState === 1) {
      const plan = await TiffinPlan.create({
        title, type, mealsPerDay, price, durationDays, description, features, includedMeals, image, badge
      });
      return res.status(201).json({ success: true, data: plan });
    } else {
      const newPlan = {
        _id: '6650000000000000' + Math.floor(10000000 + Math.random() * 90000000),
        title, type, mealsPerDay: Number(mealsPerDay), price: Number(price), durationDays: Number(durationDays),
        description, features: features || [], includedMeals: includedMeals || ['lunch', 'dinner'],
        image: image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
        badge: badge || '',
        isActive: true,
        createdAt: new Date()
      };
      mockStore.plans.push(newPlan);
      return res.status(201).json({ success: true, data: newPlan });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/plans/:id
// @desc    Update a plan (Admin)
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const plan = await TiffinPlan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
      return res.json({ success: true, data: plan });
    } else {
      const index = mockStore.plans.findIndex(p => p._id.toString() === req.params.id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Plan not found' });
      mockStore.plans[index] = { ...mockStore.plans[index], ...req.body };
      return res.json({ success: true, data: mockStore.plans[index] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/plans/:id
// @desc    Delete or soft delete a plan (Admin)
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await TiffinPlan.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: 'Plan removed' });
    } else {
      mockStore.plans = mockStore.plans.filter(p => p._id.toString() !== req.params.id);
      return res.json({ success: true, message: 'Plan removed' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
