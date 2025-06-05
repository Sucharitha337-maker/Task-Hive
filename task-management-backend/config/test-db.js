const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

// Load .env from the parent directory since we're in the config folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });

(async () => {
  try {
    console.log('Connection details:');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('Database connected successfully!');
    await connection.end();
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
})();
