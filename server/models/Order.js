const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  itemType: { type: String, enum: ['plan', 'custom_plan', 'menu_item'], default: 'plan' },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'TiffinPlan' },
  customRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomPlanRequest' },
  name: { type: String, required: true },
  type: { type: String }, // 'weekly', 'monthly', 'custom'
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  startDate: { type: Date },
  endDate: { type: Date },
  durationDays: { type: Number },
  mealsPerDay: { type: Number },
  selectedMeals: [{ type: String }],
  addOns: [{ type: Object }]
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  deliveryAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, default: 'Mohali' },
    pincode: { type: String, required: true },
    landmark: { type: String, default: '' }
  },
  deliverySlot: {
    breakfast: { type: String, default: '07:30 AM - 08:30 AM' },
    lunch: { type: String, default: '12:00 PM - 01:30 PM' },
    dinner: { type: String, default: '07:30 PM - 09:00 PM' }
  },
  deliveryInstructions: { type: String, default: '' },
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  couponCode: { type: String, default: '' },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['razorpay', 'cod'], default: 'razorpay' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  razorpayOrderId: { type: String, default: '' },
  razorpayPaymentId: { type: String, default: '' },
  orderStatus: {
    type: String,
    enum: ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
