const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

/**
 * Get All Orders
 * Optimization: Uses .populate() to convert menuItem IDs into full objects.
 * This prevents the frontend from crashing when accessing order.menuItem.name.
 */
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.menuItem', 'name price') // Only fetch needed fields for performance
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

/**
 * Create New Order
 * Fix: Implements the logic for the "Add New Order" modal seen in your video.
 */
exports.createOrder = async (req, res) => {
  try {
    const { customerName, tableNumber, items } = req.body;

    // Validate if items exist before saving
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item" });
    }

    // Calculate total amount on backend for security
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
    
    // Return populated order so frontend UI updates immediately without a refresh
    const populatedOrder = await Order.findById(savedOrder._id).populate('items.menuItem', 'name');
    
    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

/**
 * Get Top Sellers Analytics
 * Uses MongoDB Aggregation to count quantities sold per item.
 */
exports.getTopSellers = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.menuItem",
          totalSold: { $sum: "$items.quantity" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "menuitems", // Matches the collection name in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "details"
        }
      },
      { $unwind: "$details" }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Analytics failed", error: error.message });
  }
};