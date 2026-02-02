const express = require('express');
const router = express.Router();
const { 
    getMenuItems, 
    createMenuItem, 
    updateMenuItem, 
    deleteMenuItem, 
    toggleAvailability 
} = require('../controllers/menuController');

// Standard CRUD routes
router.get('/', getMenuItems);
router.post('/', createMenuItem);
router.put('/:id', updateMenuItem);
router.delete('/:id', deleteMenuItem);

// Specialized route for availability toggle
router.patch('/:id/availability', toggleAvailability);

module.exports = router;