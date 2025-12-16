const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:5173', // Vite default
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Prometheus Backend',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Test invocation endpoint
app.post('/api/invoke', (req, res) => {
  console.log('📦 Received invocation:', req.body);
  
  // Mock response for testing
  res.json({
    success: true,
    message: 'Invocation processed successfully',
    data: {
      ...req.body,
      processedAt: new Date().toISOString(),
      invocationId: `inv_${Date.now()}`,
      status: 'generated',
      requiresReview: true
    },
    metadata: {
      processingTime: '2.5s',
      model: 'test-llm',
      tokensUsed: 245
    }
  });
});

// Add your existing routes if you have them
// const mainRoutes = require('./api/routes/mainRoutes');
// app.use('/api', mainRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('🔥 Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 Prometheus Backend Server Started');
  console.log('='.repeat(50));
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
  console.log(`🔄 Invoke: POST http://localhost:${PORT}/api/invoke`);
  console.log('='.repeat(50) + '\n');
});
