const mongoose = require('mongoose');

const tiffinPlanSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  type: { type: String, enum: ['weekly', 'monthly', 'custom'], required: true },
  mealsPerDay: { type: Number, required: true, min: 1, max: 3 },
  price: { type: Number, required: true },
  durationDays: { type: Number, required: true }, // e.g. 7 for weekly, 30 for monthly
  description: { type: String, required: true },
  features: [{ type: String }],
  includedMeals: [{ type: String }], // ['lunch', 'dinner'] or ['breakfast', 'lunch', 'dinner']
  image: { type: String, default: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80' },
  isPopular: { type: Boolean, default: false },
  badge: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('TiffinPlan', tiffinPlanSchema);
