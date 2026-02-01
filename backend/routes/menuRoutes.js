const express = require('express');
const router = express.Router();
const { deleteMenuItem, toggleAvailability, updateMenuItem } = require('../controllers/menuController');

// FIX: Ensure the route is /:id to match the frontend call api.delete(`/menu/${id}`)
router.delete('/:id', deleteMenuItem);
router.patch('/:id/availability', toggleAvailability);
router.put('/:id', updateMenuItem);

module.exports = router;