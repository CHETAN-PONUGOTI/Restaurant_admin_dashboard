const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// Get All Orders
exports.getOrders = async (req, res) => {
  try {
    // Populate menuItem to ensure frontend gets name strings
    const orders = await Order.find()
      .populate('items.menuItem', 'name') 
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create New Order - Fixes the 404 issue
exports.createOrder = async (req, res) => {
  try {
    const { customerName, tableNumber, items } = req.body;
    let totalAmount = 0;

    for (const item of items) {
      const menuDetails = await MenuItem.findById(item.menuItem);
      if (menuDetails) {
        totalAmount += menuDetails.price * item.quantity;
      }
    }

    const newOrder = new Order({
      customerName,
      tableNumber,
      items,
      totalAmount,
      status: 'Pending'
    });

    const savedOrder = await newOrder.save();
    const populated = await Order.findById(savedOrder._id).populate('items.menuItem', 'name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Top Sellers
exports.getTopSellers = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.menuItem", totalSold: { $sum: "$items.quantity" } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      { $lookup: { from: "menuitems", localField: "_id", foreignField: "_id", as: "details" } },
      { $unwind: "$details" }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};