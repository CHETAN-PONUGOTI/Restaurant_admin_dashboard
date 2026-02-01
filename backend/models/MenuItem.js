const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, index: true },
  description: String,
  category: { 
    type: String, 
    required: true, 
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage'] 
  },
  price: { type: Number, required: true },
  ingredients: [String],
  isAvailable: { type: Boolean, default: true, index: true },
  preparationTime: Number,
  imageUrl: String
}, { timestamps: true });

// Text Index for optimized search (Challenge 1)
menuItemSchema.index({ name: 'text', ingredients: 'text' });

module.exports = mongoose.model('MenuItem', menuItemSchema);