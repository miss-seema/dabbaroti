const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Coupon = require('../models/Coupon');
const mockStore = require('../utils/mockStore');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   POST /api/coupons/apply
// @desc    Apply and validate promo coupon
// @access  Public
router.post('/apply', async (req, res) => {
  try {
    const { code, cartAmount } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide a coupon code' });
    }

    const upperCode = code.toUpperCase().trim();
    let coupon;

    if (mongoose.connection.readyState === 1) {
      coupon = await Coupon.findOne({ code: upperCode, isActive: true });
    } else {
      coupon = mockStore.coupons.find(c => c.code === upperCode && c.isActive);
    }

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
      return res.status(400).json({ success: false, message: 'This coupon has expired' });
    }

    const subtotal = Number(cartAmount) || 0;
    if (subtotal < (coupon.minOrderAmount || 0)) {
      return res.status(400).json({
        success: false,
        message: `Coupon requires a minimum order value of ₹${coupon.minOrderAmount}`
      });
    }

    const rawDiscount = Math.round((subtotal * coupon.discountPercent) / 100);
    const discountAmount = Math.min(coupon.maxDiscount || 500, rawDiscount);

    return res.json({
      success: true,
      message: `Coupon ${upperCode} applied! You saved ₹${discountAmount}`,
      code: upperCode,
      discountPercent: coupon.discountPercent,
      discountAmount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/coupons
// @desc    Get all coupons (Admin)
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const coupons = await Coupon.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: coupons.length, data: coupons });
    } else {
      return res.json({ success: true, count: mockStore.coupons.length, data: mockStore.coupons });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/coupons
// @desc    Create new coupon (Admin)
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { code, discountPercent, maxDiscount, minOrderAmount, validUntil } = req.body;
    if (!code || !discountPercent) {
      return res.status(400).json({ success: false, message: 'Code and discount percent are required' });
    }

    const upperCode = code.toUpperCase().trim();

    if (mongoose.connection.readyState === 1) {
      const created = await Coupon.create({
        code: upperCode,
        discountPercent: Number(discountPercent),
        maxDiscount: Number(maxDiscount) || 500,
        minOrderAmount: Number(minOrderAmount) || 500,
        validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 60*24*60*60*1000)
      });
      return res.status(201).json({ success: true, data: created });
    } else {
      const newCoupon = {
        _id: '6650000000000000' + Math.floor(10000000 + Math.random() * 90000000),
        code: upperCode,
        discountPercent: Number(discountPercent),
        maxDiscount: Number(maxDiscount) || 500,
        minOrderAmount: Number(minOrderAmount) || 500,
        validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 60*24*60*60*1000),
        isActive: true,
        createdAt: new Date()
      };
      mockStore.coupons.push(newCoupon);
      return res.status(201).json({ success: true, data: newCoupon });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/coupons/:id
// @desc    Delete coupon (Admin)
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Coupon.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: 'Coupon deleted' });
    } else {
      mockStore.coupons = mockStore.coupons.filter(c => c._id.toString() !== req.params.id);
      return res.json({ success: true, message: 'Coupon deleted' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
