require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// 1. Connectivity
connectDB();

// 2. Security & Performance Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Gzip compression
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Prevent large payload attacks
app.use(morgan('dev')); // Logging

// 3. Rate Limiting (Prevent Brute Force/DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// 4. Routes
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// 5. Error Handling (Global)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server optimized & running on port ${PORT}`));