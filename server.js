const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});

// Parse URL-encoded bodies and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    service: 'Security Scanner Demo',
    version: '1.0.0',
    environment: 'development'
  });
});

// Basic documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    endpoints: [
      'GET /health - Health check',
      'GET /api/status - Service status',
      'GET /api/docs - This documentation'
    ],
    description: 'Minimal API for security scanning demonstration'
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Security Scanner Demo API',
    documentation: '/api/docs',
    health: '/health',
    status: '/api/status'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
