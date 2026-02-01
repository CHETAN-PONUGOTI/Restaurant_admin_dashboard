const MenuItem = require('../models/MenuItem');

/**
 * Get All Menu Items
 */
exports.getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1, name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch menu items", error: error.message });
  }
};

/**
 * Create Menu Item
 */
exports.createMenuItem = async (req, res) => {
  try {
    const newItem = new MenuItem(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: "Validation error", error: error.message });
  }
};

/**
 * Update Menu Item
 */
exports.updateMenuItem = async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) return res.status(404).json({ message: "Item not found" });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: "Update failed", error: error.message });
  }
};

/**
 * Toggle Item Availability
 * Optimization: Uses a findById and save pattern to trigger any potential middleware.
 */
exports.toggleAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    
    item.isAvailable = !item.isAvailable;
    await item.save();
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Status toggle failed", error: error.message });
  }
};

/**
 * Delete Menu Item
 * Fix: Ensures the deletion logic handles the ID correctly to avoid the 404 errors 
 * seen in your video (0:01:14).
 */
exports.deleteMenuItem = async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found in database" });
    }
    // Optimization: Return a clear JSON message to stop frontend catch blocks
    res.json({ message: "Item successfully deleted", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Delete operation failed", error: error.message });
  }
};