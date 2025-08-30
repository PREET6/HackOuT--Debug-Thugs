// Add this to the top of your server.js file
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
  process.exit(1);
});
const mysql = require('mysql2');

// First connect without database to check/create it
const adminConnection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root'
});

console.log('Checking database setup...');

adminConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL server:', err.message);
    console.log('Please make sure MySQL is running and credentials are correct');
    return;
  }
  
  // Create database if it doesn't exist
  adminConnection.query('CREATE DATABASE IF NOT EXISTS coastal_alert_db', (err) => {
    if (err) {
      console.error('Error creating database:', err.message);
      adminConnection.end();
      return;
    }
    
    console.log('Database ensured: coastal_alert_db');
    
    // Now connect to the specific database
    const connection = mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'coastal_alert_db'
    });
    
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to database:', err.message);
        return;
      }
      
      console.log('Connected to MySQL database successfully!');
      startServer(connection);
    });
    
    adminConnection.end();
  });
});

function startServer(connection) {
  const express = require('express');
  const app = express();
  const PORT = process.env.PORT || 5000;

  // Middleware
  app.use(express.json());

  // Health endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      message: 'Server is running with database connection!',
      timestamp: new Date().toISOString()
    });
  });

  // Start server
  app.listen(PORT, () => {
    console.log('✅ Server running on port:', PORT);
    console.log('🌐 Health check: http://localhost:' + PORT + '/health');
  });
}