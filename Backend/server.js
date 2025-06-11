require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Verify that environment variables are loaded
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI environment variable is not set in .env file');
  process.exit(1);
}

// Connect to database
connectDB();

// Initialize express
const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Radiance Dance API Server is running'
  });
});

// Make sure all routes are registered
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/classes', require('./src/routes/classRoutes'));
app.use('/api/instructors', require('./src/routes/instructorRoutes'));
app.use('/api/events', require('./src/routes/eventRoutes'));
app.use('/api/payments', require('./src/routes/paymentRoutes'));
app.use('/api/enrollments', require('./src/routes/enrollmentRoutes'));

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => 
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});