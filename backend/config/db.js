const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password', // Make sure this matches your MySQL root password
  port: process.env.DB_PORT || 3306,
};

const dbName = process.env.DB_NAME || 'blood_connect_db';

let pool;

async function initializeDatabase() {
  try {
    console.log("Checking database schema...");
    // 1. Connect without specifying a database to check if it exists
    const tempConnection = await mysql.createConnection(dbConfig);
    
    // 2. Create the database if it doesn't exist
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await tempConnection.end();

    // 3. Now, create the connection pool to the specific database
    pool = mysql.createPool({
      ...dbConfig,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    console.log("Database connected...");

    // 4. Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS donors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullName VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        bloodGroup VARCHAR(10) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        location VARCHAR(255) NOT NULL,
        availability VARCHAR(50) NOT NULL,
        medicalHistory TEXT,
        emergencyContact VARCHAR(20),
        registeredDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        receivedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'Unread'
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `);

    console.log("Tables initialized successfully.");

    // 5. Create a default admin user if one doesn't exist
    const [admins] = await pool.query('SELECT * FROM admins WHERE username = ?', ['admin']);
    if (admins.length === 0) {
      const hashedPassword = await bcrypt.hash('bloodconnect2024', 10);
      await pool.query('INSERT INTO admins (username, password) VALUES (?, ?)', ['admin', hashedPassword]);
      console.log("Default admin user created.");
    } else {
      console.log("Default admin user is available.");
    }

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1); // Exit the process with an error code
  }
}

function getPool() {
  if (!pool) {
    throw new Error("Database pool not initialized. Call initializeDatabase() first.");
  }
  return pool;
}

module.exports = {
  initializeDatabase,
  getPool
};
