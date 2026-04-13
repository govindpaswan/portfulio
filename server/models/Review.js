const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  photo: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  message: { type: String, required: true },
  designation: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
