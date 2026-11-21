const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Subscription = require('../models/Subscription');
const Coupon = require('../models/Coupon');
const mockStore = require('../utils/mockStore');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Helper to generate readable Order & Subscription ID
const generateOrderNumber = () => 'DR-ORD-' + Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900);
const generateSubNumber = () => 'SUB-DR-' + Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900);

// @route   POST /api/orders
// @desc    Create new order & initialize subscription
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      items, deliveryAddress, deliverySlot, deliveryInstructions,
      couponCode, paymentMethod
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
    }

    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Valid delivery address is required' });
    }

    // Calculate subtotal
    let subtotal = 0;
    items.forEach(item => {
      subtotal += (item.price || 0) * (item.quantity || 1);
    });

    // Check discount
    let discount = 0;
    if (couponCode) {
      const codeUpper = couponCode.toUpperCase().trim();
      let coupon;
      if (mongoose.connection.readyState === 1) {
        coupon = await Coupon.findOne({ code: codeUpper, isActive: true });
      } else {
        coupon = mockStore.coupons.find(c => c.code === codeUpper && c.isActive);
      }

      if (coupon && subtotal >= (coupon.minOrderAmount || 0)) {
        discount = Math.min(coupon.maxDiscount || 500, Math.round((subtotal * coupon.discountPercent) / 100));
      }
    }

    // Free delivery on orders over ₹1000 or subscriptions
    const deliveryFee = subtotal > 1000 ? 0 : 40;
    const totalAmount = Math.max(0, subtotal - discount + deliveryFee);

    const orderNumber = generateOrderNumber();
    const isCod = paymentMethod === 'cod';

    const orderData = {
      orderNumber,
      user: req.user._id,
      items,
      deliveryAddress,
      deliverySlot: deliverySlot || {
        breakfast: '07:30 AM - 08:30 AM',
        lunch: '12:00 PM - 01:30 PM',
        dinner: '07:30 PM - 09:00 PM'
      },
      deliveryInstructions: deliveryInstructions || '',
      subtotal,
      deliveryFee,
      discount,
      couponCode: couponCode || '',
      totalAmount,
      paymentMethod: paymentMethod || 'razorpay',
      paymentStatus: isCod ? 'pending' : 'pending',
      orderStatus: isCod ? 'confirmed' : 'placed'
    };

    let createdOrder;
    let createdSubscriptions = [];

    if (mongoose.connection.readyState === 1) {
      createdOrder = await Order.create(orderData);

      // Create subscriptions for plan items
      for (const item of items) {
        if (item.itemType === 'plan' || item.type === 'weekly' || item.type === 'monthly' || item.itemType === 'custom_plan') {
          const duration = item.durationDays || (item.type === 'weekly' ? 7 : 30);
          const start = item.startDate ? new Date(item.startDate) : new Date();
          const end = item.endDate ? new Date(item.endDate) : new Date(start.getTime() + duration * 24 * 60 * 60 * 1000);

          const sub = await Subscription.create({
            subscriptionNumber: generateSubNumber(),
            user: req.user._id,
            order: createdOrder._id,
            plan: item.planId,
            planTitle: item.name,
            planType: item.type || (duration <= 7 ? 'weekly' : 'monthly'),
            mealsPerDay: item.mealsPerDay || 2,
            selectedMeals: item.selectedMeals || ['lunch', 'dinner'],
            startDate: start,
            endDate: end,
            totalDays: duration,
            remainingDays: duration,
            deliveryAddress,
            deliverySlot: orderData.deliverySlot,
            status: isCod ? 'active' : 'active'
          });
          createdSubscriptions.push(sub);
        }
      }

      return res.status(201).json({
        success: true,
        order: createdOrder,
        subscriptions: createdSubscriptions
      });
    } else {
      createdOrder = {
        _id: '6650000000000000' + Math.floor(10000000 + Math.random() * 90000000),
        ...orderData,
        createdAt: new Date()
      };
      mockStore.orders.unshift(createdOrder);

      for (const item of items) {
        if (item.itemType === 'plan' || item.type === 'weekly' || item.type === 'monthly' || item.itemType === 'custom_plan') {
          const duration = item.durationDays || (item.type === 'weekly' ? 7 : 30);
          const start = item.startDate ? new Date(item.startDate) : new Date();
          const end = item.endDate ? new Date(item.endDate) : new Date(start.getTime() + duration * 24 * 60 * 60 * 1000);

          const sub = {
            _id: '6650000000000000' + Math.floor(10000000 + Math.random() * 90000000),
            subscriptionNumber: generateSubNumber(),
            user: req.user._id,
            order: createdOrder._id,
            planTitle: item.name,
            planType: item.type || (duration <= 7 ? 'weekly' : 'monthly'),
            mealsPerDay: item.mealsPerDay || 2,
            selectedMeals: item.selectedMeals || ['lunch', 'dinner'],
            startDate: start,
            endDate: end,
            totalDays: duration,
            remainingDays: duration,
            deliveryAddress,
            deliverySlot: orderData.deliverySlot,
            status: 'active',
            pauseHistory: [],
            createdAt: new Date()
          };
          mockStore.subscriptions.unshift(sub);
          createdSubscriptions.push(sub);
        }
      }

      return res.status(201).json({
        success: true,
        order: createdOrder,
        subscriptions: createdSubscriptions
      });
    }
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get logged in user orders
// @access  Private
router.get('/my-orders', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, data: orders });
    } else {
      const orders = mockStore.orders.filter(o => o.user.toString() === req.user._id.toString());
      return res.json({ success: true, count: orders.length, data: orders });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const order = await Order.findById(req.params.id).populate('user', 'name email phone');
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      return res.json({ success: true, data: order });
    } else {
      const order = mockStore.orders.find(o => o._id.toString() === req.params.id || o.orderNumber === req.params.id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      return res.json({ success: true, data: order });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders
// @desc    Admin get all orders
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const orders = await Order.find().populate('user', 'name email phone').sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, data: orders });
    } else {
      return res.json({ success: true, count: mockStore.orders.length, data: mockStore.orders });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Admin update order status
// @access  Private/Admin
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    if (mongoose.connection.readyState === 1) {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      if (orderStatus) order.orderStatus = orderStatus;
      if (paymentStatus) order.paymentStatus = paymentStatus;

      const updated = await order.save();
      return res.json({ success: true, data: updated });
    } else {
      const order = mockStore.orders.find(o => o._id.toString() === req.params.id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      if (orderStatus) order.orderStatus = orderStatus;
      if (paymentStatus) order.paymentStatus = paymentStatus;

      return res.json({ success: true, data: order });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
