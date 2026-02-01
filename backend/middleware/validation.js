const { body, validationResult } = require('express-validator');

const validateMenu = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('category').isIn(['Appetizer', 'Main Course', 'Dessert', 'Beverage']),
  body('price').isFloat({ min: 0 }).withMessage('Valid price required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

module.exports = { validateMenu };