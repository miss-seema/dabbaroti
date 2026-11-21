const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    enum: ['breakfast', 'lunch', 'dinner', 'addon'], 
    required: true 
  },
  description: { type: String, required: true },
  price: { type: Number, default: 0 },
  isVeg: { type: Boolean, default: true },
  dietaryTags: [{ type: String }], // 'High Protein', 'Gluten Free', 'Jain Option'
  calories: { type: Number, default: 350 },
  portion: { type: String, default: 'Standard Tiffin Box' },
  image: { type: String, required: true },
  dayOfWeek: [{ type: String }], // ['Monday', 'Tuesday', ... or 'Daily']
  isAvailable: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
