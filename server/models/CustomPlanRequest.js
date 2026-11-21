const mongoose = require('mongoose');

const customPlanRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalDays: { type: Number, required: true },
  mealsPerDay: { type: Number, required: true },
  selectedMeals: [{ type: String }], // 'breakfast', 'lunch', 'dinner'
  selectedDays: [{ type: String }], // 'Monday', 'Tuesday', ... or 'All Days'
  dietaryType: { type: String, enum: ['Veg', 'Non-Veg', 'Jain', 'Swaminarayan', 'Eggitarian'], default: 'Veg' },
  spiceLevel: { type: String, enum: ['Mild', 'Medium', 'Spicy'], default: 'Medium' },
  addOns: [{
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number, default: 1 }
  }],
  specialInstructions: { type: String, default: '' },
  deliveryAddress: {
    street: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, default: 'Mohali' },
    pincode: { type: String, required: true },
    landmark: { type: String, default: '' }
  },
  estimatedPrice: { type: Number, required: true },
  approvedPrice: { type: Number },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminNotes: { type: String, default: '' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.model('CustomPlanRequest', customPlanRequestSchema);
