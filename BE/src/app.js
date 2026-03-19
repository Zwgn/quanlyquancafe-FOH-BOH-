const express = require('express');
const cors = require('cors');
const { getPool } = require('./config/db');
const setupRoutes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database connection on startup
(async () => {
  try {
    await getPool();
  } catch (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }
})();

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
setupRoutes(app);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

module.exports = app;
