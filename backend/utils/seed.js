require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

const sampleMenuItems = [
  // Appetizers
  { name: 'Garlic Parmesan Wings', category: 'Appetizer', price: 12.99, ingredients: ['Chicken', 'Garlic', 'Parmesan'], isAvailable: true, preparationTime: 15, imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f' },
  { name: 'Crispy Calamari', category: 'Appetizer', price: 14.50, ingredients: ['Squid', 'Flour', 'Lemon', 'Marinara'], isAvailable: true, preparationTime: 12, imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0' },
  { name: 'Stuffed Mushrooms', category: 'Appetizer', price: 10.00, ingredients: ['Mushrooms', 'Cheese', 'Herbs'], isAvailable: true, preparationTime: 10, imageUrl: 'https://images.unsplash.com/photo-1608039755401-742074f0548d' },
  { name: 'Spinach Artichoke Dip', category: 'Appetizer', price: 11.00, ingredients: ['Spinach', 'Artichoke', 'Cream Cheese', 'Chips'], isAvailable: false, preparationTime: 8, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyqL4Eu8RRsohIhImawQFzxizTzG3teAuupQ&s' },

  // Main Courses
  { name: 'Truffle Ribeye Steak', category: 'Main Course', price: 34.99, ingredients: ['Beef', 'Truffle Oil', 'Potato', 'Asparagus'], isAvailable: true, preparationTime: 25, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSts2IDGWErTzpNXLtpa5St-yqyr7enw8SJvA&s' },
  { name: 'Wild Salmon Risotto', category: 'Main Course', price: 28.00, ingredients: ['Salmon', 'Arborio Rice', 'Peas', 'Lemon'], isAvailable: true, preparationTime: 20, imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2' },
  { name: 'Classic Wagyu Burger', category: 'Main Course', price: 18.50, ingredients: ['Wagyu Beef', 'Brioche', 'Cheddar', 'Fries'], isAvailable: true, preparationTime: 15, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd' },
  { name: 'Eggplant Lasagna', category: 'Main Course', price: 16.00, ingredients: ['Eggplant', 'Ricotta', 'Tomato Sauce', 'Pasta'], isAvailable: true, preparationTime: 22, imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141' },
  { name: 'Thai Green Curry', category: 'Main Course', price: 17.00, ingredients: ['Coconut Milk', 'Basil', 'Bamboo Shoots', 'Rice'], isAvailable: true, preparationTime: 18, imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd' },

  // Desserts
  { name: 'Molten Chocolate Cake', category: 'Dessert', price: 9.50, ingredients: ['Dark Chocolate', 'Flour', 'Vanilla Ice Cream'], isAvailable: true, preparationTime: 15, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIUvN8FpeZ5_BzmUfc0rD1oQkXAK8hcp9icw&s' },
  { name: 'New York Cheesecake', category: 'Dessert', price: 8.00, ingredients: ['Cream Cheese', 'Graham Cracker', 'Strawberry'], isAvailable: true, preparationTime: 5, imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad' },
  { name: 'Matcha Tiramisu', category: 'Dessert', price: 10.50, ingredients: ['Matcha', 'Mascarpone', 'Ladyfingers'], isAvailable: true, preparationTime: 10, imageUrl: 'https://images.unsplash.com/photo-1582716401301-b2407dc7563d' },

  // Beverages
  { name: 'Craft Iced Latte', category: 'Beverage', price: 5.50, ingredients: ['Espresso', 'Milk', 'Vanilla'], isAvailable: true, preparationTime: 5, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWmrj53n76kYb-SMfWFpb7O4Ww3Hit6cxUPw&s' },
  { name: 'Fresh Mint Lemonade', category: 'Beverage', price: 4.50, ingredients: ['Lemon', 'Mint', 'Cane Sugar'], isAvailable: true, preparationTime: 4, imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd' },
  { name: 'Hibiscus Hot Tea', category: 'Beverage', price: 4.00, ingredients: ['Hibiscus Petals', 'Honey'], isAvailable: true, preparationTime: 3, imageUrl: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256' }
];

const seedDB = async () => {
  try {
    // 1. Connect to DB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // 2. Clear existing data (Optimization: Batch delete)
    await MenuItem.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared existing collections.');

    // 3. Insert Menu Items
    const createdItems = await MenuItem.insertMany(sampleMenuItems);
    console.log(`Successfully seeded ${createdItems.length} menu items.`);

    // 4. Generate Sample Orders for Analytics
    const sampleOrders = [
      {
        customerName: 'John Doe',
        tableNumber: 5,
        status: 'Delivered',
        items: [
          { menuItem: createdItems[4]._id, quantity: 2, price: createdItems[4].price }, // Ribeye
          { menuItem: createdItems[12]._id, quantity: 2, price: createdItems[12].price } // Latte
        ],
        totalAmount: (createdItems[4].price * 2) + (createdItems[12].price * 2)
      },
      {
        customerName: 'Jane Smith',
        tableNumber: 2,
        status: 'Preparing',
        items: [
          { menuItem: createdItems[6]._id, quantity: 1, price: createdItems[6].price }, // Burger
          { menuItem: createdItems[0]._id, quantity: 1, price: createdItems[0].price }  // Wings
        ],
        totalAmount: createdItems[6].price + createdItems[0].price
      },
      {
        customerName: 'Alice Wong',
        tableNumber: 10,
        status: 'Delivered',
        items: [
          { menuItem: createdItems[4]._id, quantity: 1, price: createdItems[4].price }, // Ribeye
          { menuItem: createdItems[9]._id, quantity: 1, price: createdItems[9].price }  // Cake
        ],
        totalAmount: createdItems[4].price + createdItems[9].price
      },
      {
        customerName: 'Bob Vance',
        tableNumber: 8,
        status: 'Cancelled',
        items: [
          { menuItem: createdItems[1]._id, quantity: 3, price: createdItems[1].price }  // Calamari
        ],
        totalAmount: createdItems[1].price * 3
      },
      {
        customerName: 'Charlie Day',
        tableNumber: 3,
        status: 'Delivered',
        items: [
          { menuItem: createdItems[4]._id, quantity: 1, price: createdItems[4].price }, // Ribeye
          { menuItem: createdItems[14]._id, quantity: 1, price: createdItems[14].price } // Tea
        ],
        totalAmount: createdItems[4].price + createdItems[14].price
      }
    ];

    await Order.insertMany(sampleOrders);
    console.log('Successfully seeded sample orders.');

    console.log('--- Seeding Process Complete ---');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();