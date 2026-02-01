const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { 
    type: String, 
    unique: true, 
    default: () => `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}` 
  },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true } // Snapshot of price at time of order
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'],
    default: 'Pending',
    index: true // Optimization for dashboard filtering
  },
  customerName: { type: String, required: true },
  tableNumber: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);