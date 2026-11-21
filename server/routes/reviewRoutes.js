const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Review = require('../models/Review');
const mockStore = require('../utils/mockStore');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/reviews
// @desc    Get customer reviews
// @access  Public
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 }).limit(10);
      return res.json({ success: true, count: reviews.length, data: reviews });
    } else {
      const reviews = mockStore.reviews.filter(r => r.isApproved);
      return res.json({ success: true, count: reviews.length, data: reviews });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/reviews
// @desc    Submit a review
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { rating, comment, planName } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required' });
    }

    const reviewData = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
      planName: planName || 'Tiffin Subscription',
      isApproved: true
    };

    if (mongoose.connection.readyState === 1) {
      const created = await Review.create(reviewData);
      return res.status(201).json({ success: true, data: created });
    } else {
      const newReview = {
        _id: '6650000000000000' + Math.floor(10000000 + Math.random() * 90000000),
        ...reviewData,
        createdAt: new Date()
      };
      mockStore.reviews.unshift(newReview);
      return res.status(201).json({ success: true, data: newReview });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
