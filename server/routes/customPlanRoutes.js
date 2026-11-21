const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CustomPlanRequest = require('../models/CustomPlanRequest');
const mockStore = require('../utils/mockStore');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Calculate dynamic price based on days, meals, and add-ons
const calculateCustomPlanPrice = ({ startDate, endDate, selectedMeals = [], selectedDays = [], addOns = [] }) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const totalCalendarDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

  // Determine active days count
  let activeDaysCount = 0;
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const currentDayName = dayNames[d.getDay()];
    if (selectedDays.length === 0 || selectedDays.includes('All Days') || selectedDays.includes(currentDayName)) {
      activeDaysCount++;
    }
  }

  // Meal rates per day
  let mealRatePerDay = 0;
  if (selectedMeals.includes('breakfast')) mealRatePerDay += 45;
  if (selectedMeals.includes('lunch')) mealRatePerDay += 70;
  if (selectedMeals.includes('dinner')) mealRatePerDay += 70;

  let baseMealTotal = activeDaysCount * mealRatePerDay;

  // Add-ons total
  let addOnsPerDay = 0;
  addOns.forEach(addon => {
    addOnsPerDay += (addon.price || 0) * (addon.quantity || 1);
  });
  const addOnsTotal = activeDaysCount * addOnsPerDay;

  let rawTotal = baseMealTotal + addOnsTotal;

  // Volume discount: Monthly (>=28 days) gives ~15% off, Weekly (>=7 days) gives ~5% off
  let discount = 0;
  if (activeDaysCount >= 28) {
    discount = Math.round(rawTotal * 0.15);
  } else if (activeDaysCount >= 7) {
    discount = Math.round(rawTotal * 0.05);
  }

  const finalEstimatedPrice = Math.max(150, rawTotal - discount);

  return {
    totalCalendarDays,
    activeDaysCount,
    mealRatePerDay,
    baseMealTotal,
    addOnsTotal,
    discount,
    finalEstimatedPrice
  };
};

// @route   POST /api/custom-plans/calculate
// @desc    Calculate live dynamic quote for custom plan
// @access  Public
router.post('/calculate', (req, res) => {
  try {
    const { startDate, endDate, selectedMeals, selectedDays, addOns } = req.body;
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Start and end dates are required' });
    }
    const calculation = calculateCustomPlanPrice({ startDate, endDate, selectedMeals, selectedDays, addOns });
    res.json({ success: true, calculation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/custom-plans/request
// @desc    Submit a custom plan subscription request
// @access  Private
router.post('/request', protect, async (req, res) => {
  try {
    const {
      name, email, phone, startDate, endDate, mealsPerDay,
      selectedMeals, selectedDays, dietaryType, spiceLevel,
      addOns, specialInstructions, deliveryAddress
    } = req.body;

    const calc = calculateCustomPlanPrice({ startDate, endDate, selectedMeals, selectedDays, addOns });

    const requestData = {
      user: req.user._id,
      name: name || req.user.name,
      email: email || req.user.email,
      phone: phone || req.user.phone,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalDays: calc.activeDaysCount,
      mealsPerDay: Number(mealsPerDay) || selectedMeals.length,
      selectedMeals: selectedMeals || ['lunch', 'dinner'],
      selectedDays: selectedDays || ['All Days'],
      dietaryType: dietaryType || 'Veg',
      spiceLevel: spiceLevel || 'Medium',
      addOns: addOns || [],
      specialInstructions: specialInstructions || '',
      deliveryAddress: deliveryAddress || (req.user.addresses && req.user.addresses[0]) || {
        street: 'Main Road', area: 'Central', city: 'Mohali', pincode: '452001'
      },
      estimatedPrice: calc.finalEstimatedPrice,
      status: 'pending'
    };

    if (mongoose.connection.readyState === 1) {
      const created = await CustomPlanRequest.create(requestData);
      return res.status(201).json({ success: true, message: 'Custom plan request submitted successfully for admin review.', data: created });
    } else {
      const newRequest = {
        _id: '6650000000000000' + Math.floor(10000000 + Math.random() * 90000000),
        ...requestData,
        createdAt: new Date()
      };
      mockStore.customRequests.push(newRequest);
      return res.status(201).json({ success: true, message: 'Custom plan request submitted successfully for admin review.', data: newRequest });
    }
  } catch (error) {
    console.error('Custom plan request error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/custom-plans/my-requests
// @desc    Get customer's own custom plan requests
// @access  Private
router.get('/my-requests', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const requests = await CustomPlanRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
      return res.json({ success: true, count: requests.length, data: requests });
    } else {
      const requests = mockStore.customRequests.filter(r => r.user.toString() === req.user._id.toString());
      return res.json({ success: true, count: requests.length, data: requests });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/custom-plans/all
// @desc    Get all custom plan requests (Admin)
// @access  Private/Admin
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const requests = await CustomPlanRequest.find().populate('user', 'name email phone').sort({ createdAt: -1 });
      return res.json({ success: true, count: requests.length, data: requests });
    } else {
      return res.json({ success: true, count: mockStore.customRequests.length, data: mockStore.customRequests });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/custom-plans/:id/status
// @desc    Admin approve or reject custom plan with price adjustment
// @access  Private/Admin
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, approvedPrice, adminNotes } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    if (mongoose.connection.readyState === 1) {
      const request = await CustomPlanRequest.findById(req.params.id);
      if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

      request.status = status;
      if (approvedPrice !== undefined) request.approvedPrice = Number(approvedPrice);
      if (adminNotes !== undefined) request.adminNotes = adminNotes;
      request.reviewedBy = req.user._id;
      request.reviewedAt = new Date();

      const updated = await request.save();
      return res.json({ success: true, data: updated });
    } else {
      const reqItem = mockStore.customRequests.find(r => r._id.toString() === req.params.id);
      if (!reqItem) return res.status(404).json({ success: false, message: 'Request not found' });

      reqItem.status = status;
      if (approvedPrice !== undefined) reqItem.approvedPrice = Number(approvedPrice);
      if (adminNotes !== undefined) reqItem.adminNotes = adminNotes;
      reqItem.reviewedBy = req.user._id;
      reqItem.reviewedAt = new Date();

      return res.json({ success: true, data: reqItem });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
