const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  avatar: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  planName: { type: String, default: 'Monthly Subscription' },
  isApproved: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
