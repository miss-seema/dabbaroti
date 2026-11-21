const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  subscriptionNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'TiffinPlan' },
  planTitle: { type: String, required: true },
  planType: { type: String, enum: ['weekly', 'monthly', 'custom'], required: true },
  mealsPerDay: { type: Number, required: true },
  selectedMeals: [{ type: String }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalDays: { type: Number, required: true },
  remainingDays: { type: Number },
  deliveryAddress: { type: Object, required: true },
  deliverySlot: { type: Object },
  status: { 
    type: String, 
    enum: ['active', 'paused', 'completed', 'cancelled'], 
    default: 'active' 
  },
  pauseHistory: [{
    pausedFrom: { type: Date },
    pausedUntil: { type: Date },
    reason: { type: String }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
