const express = require('express');
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running (no database connection)',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log('✅ Server running on port:', PORT);
  console.log('🌐 Health check: http://localhost:' + PORT + '/health');
  console.log('💡 Database connection: DISABLED (for testing only)');
});