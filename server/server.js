const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/plans', require('./routes/planRoutes'));
app.use('/api/custom-plans', require('./routes/customPlanRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health & Root status route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'Dabba Roti',
    service: 'Home-style Daily Tiffin & Meal Subscription',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static files in production (Hostinger, Render, VPS, or Docker)
if (process.env.NODE_ENV === 'production') {
  const possiblePaths = [
    path.join(__dirname, '../dist'),
    path.join(__dirname, '../client/dist'),
    path.join(__dirname, '../public_html')
  ];
  const clientDistPath = possiblePaths.find(p => fs.existsSync(path.join(p, 'index.html'))) || possiblePaths[0];

  app.use(express.static(clientDistPath));

  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      const indexPath = path.join(clientDistPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
      }
    } else {
      res.status(404).json({ success: false, message: `API route ${req.originalUrl} not found` });
    }
  });
} else {
  // 404 handler for API routes in development
  app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, message: `API route ${req.originalUrl} not found` });
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5001;

// Only bind port if not running as a serverless function (e.g. Vercel)
if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Dabba Roti Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`🥘 Website: www.dabbaroti.com`);
    console.log(`🍛 Tagline: "A Taste You'll Keep Coming Back For!"`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const fallbackPort = Number(PORT) + 1;
      console.warn(`⚠️ Port ${PORT} was busy, automatically listening on fallback port ${fallbackPort}`);
      app.listen(fallbackPort);
    } else {
      console.error('Server error:', err);
    }
  });
}

module.exports = app;
