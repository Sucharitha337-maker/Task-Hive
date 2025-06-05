const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,       // Database host (e.g., localhost)
  user: process.env.DB_USER,       // Database username (e.g., root)
  password: process.env.DB_PASSWORD, // Database password
  database: process.env.DB_NAME,   // Database name (e.g., task_management)
  port: process.env.DB_PORT || 3306, // Default to 3306 if DB_PORT is not defined
  waitForConnections: true,
  connectionLimit: 10,             // Maximum number of connections in the pool
  queueLimit: 0                    // Queue limit for connections
});

module.exports = pool;
