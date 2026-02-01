const express = require('express');
const router = express.Router();
const { 
    getOrders, 
    createOrder, 
    getTopSellers 
} = require('../controllers/orderController');

/**
 * @route   GET /api/orders
 * @desc    Get all orders with populated menu item details
 * @access  Admin
 */
router.get('/', getOrders);

/**
 * @route   POST /api/orders
 * @desc    Create a new order from the dashboard
 * @access  Admin
 * FIX: This was returning 404 because the endpoint wasn't registered.
 */
router.post('/', createOrder);

/**
 * @route   GET /api/orders/analytics/top-sellers
 * @desc    Get top 5 selling items using MongoDB aggregation
 * @access  Admin
 */
router.get('/analytics/top-sellers', getTopSellers);

module.exports = router;