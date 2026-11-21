const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Subscription = require('../models/Subscription');
const CustomPlanRequest = require('../models/CustomPlanRequest');
const User = require('../models/User');
const mockStore = require('../utils/mockStore');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   GET /api/admin/stats
// @desc    Get Admin Dashboard Overview Statistics
// @access  Private/Admin
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const totalOrders = await Order.countDocuments();
      const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });
      const pendingCustomRequests = await CustomPlanRequest.countDocuments({ status: 'pending' });
      const totalCustomers = await User.countDocuments({ role: 'customer' });

      // Revenue aggregate
      const revenueData = await Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);
      const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

      const recentOrders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(5);

      return res.json({
        success: true,
        data: {
          totalRevenue,
          totalOrders,
          activeSubscriptions,
          pendingCustomRequests,
          totalCustomers,
          recentOrders
        }
      });
    } else {
      // In-memory calculations
      const totalOrders = mockStore.orders.length;
      const activeSubscriptions = mockStore.subscriptions.filter(s => s.status === 'active').length;
      const pendingCustomRequests = mockStore.customRequests.filter(r => r.status === 'pending').length;
      const totalCustomers = mockStore.users.filter(u => u.role === 'customer').length;
      const totalRevenue = mockStore.orders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      const recentOrders = mockStore.orders.slice(0, 5);

      return res.json({
        success: true,
        data: {
          totalRevenue,
          totalOrders,
          activeSubscriptions,
          pendingCustomRequests,
          totalCustomers,
          recentOrders
        }
      });
    }
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users list
// @access  Private/Admin
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.json({ success: true, count: users.length, data: users });
    } else {
      const sanitized = mockStore.users.map(({ password, ...u }) => u);
      return res.json({ success: true, count: sanitized.length, data: sanitized });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
