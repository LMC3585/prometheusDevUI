const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Simple test routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Test server is running',
    timestamp: new Date().toISOString() 
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'API is working',
    endpoints: ['/health', '/api', '/api/invoke']
  });
});

app.post('/api/invoke', (req, res) => {
  console.log('Received:', req.body);
  res.json({
    success: true,
    data: req.body,
    invocationId: 'test_' + Date.now(),
    message: 'Test invocation successful'
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(\✅ Test server running on http://localhost:\\);
  console.log(\📡 Health check: http://localhost:\/health\);
});
