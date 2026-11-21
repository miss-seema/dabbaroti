const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const mockStore = require('../utils/mockStore');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   GET /api/menu
// @desc    Get all menu items (filter by category, isVeg, day)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, isVeg, day } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter = { isAvailable: true };
      if (category && category !== 'all') filter.category = category;
      if (isVeg !== undefined) filter.isVeg = isVeg === 'true';
      if (day) filter.dayOfWeek = { $in: [day, 'Daily'] };

      const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
      return res.json({ success: true, count: items.length, data: items });
    } else {
      let items = mockStore.menuItems.filter(i => i.isAvailable);
      if (category && category !== 'all') items = items.filter(i => i.category === category);
      if (isVeg !== undefined) items = items.filter(i => i.isVeg === (isVeg === 'true'));
      if (day) items = items.filter(i => i.dayOfWeek.includes(day) || i.dayOfWeek.includes('Daily'));
      return res.json({ success: true, count: items.length, data: items });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/menu/:id
// @desc    Get single menu item
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const item = await MenuItem.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
      return res.json({ success: true, data: item });
    } else {
      const item = mockStore.menuItems.find(i => i._id.toString() === req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
      return res.json({ success: true, data: item });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/menu
// @desc    Create menu item (Admin)
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, category, description, price, isVeg, dietaryTags, calories, portion, image, dayOfWeek } = req.body;

    if (!name || !category || !description) {
      return res.status(400).json({ success: false, message: 'Name, category, and description are required' });
    }

    if (mongoose.connection.readyState === 1) {
      const created = await MenuItem.create({
        name, category, description, price, isVeg, dietaryTags, calories, portion,
        image: image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
        dayOfWeek: dayOfWeek || ['Daily'],
        isAvailable: true
      });
      return res.status(201).json({ success: true, data: created });
    } else {
      const newItem = {
        _id: '6650000000000000' + Math.floor(10000000 + Math.random() * 90000000),
        name, category, description, price: Number(price) || 0, isVeg: Boolean(isVeg),
        dietaryTags: dietaryTags || [], calories: Number(calories) || 350, portion: portion || 'Standard Portion',
        image: image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
        dayOfWeek: dayOfWeek || ['Daily'],
        isAvailable: true,
        createdAt: new Date()
      };
      mockStore.menuItems.push(newItem);
      return res.status(201).json({ success: true, data: newItem });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/menu/:id
// @desc    Update menu item (Admin)
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Item not found' });
      return res.json({ success: true, data: updated });
    } else {
      const index = mockStore.menuItems.findIndex(i => i._id.toString() === req.params.id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Item not found' });
      mockStore.menuItems[index] = { ...mockStore.menuItems[index], ...req.body };
      return res.json({ success: true, data: mockStore.menuItems[index] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/menu/:id
// @desc    Delete menu item (Admin)
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await MenuItem.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: 'Menu item deleted' });
    } else {
      mockStore.menuItems = mockStore.menuItems.filter(i => i._id.toString() !== req.params.id);
      return res.json({ success: true, message: 'Menu item deleted' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
