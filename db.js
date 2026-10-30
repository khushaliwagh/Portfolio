const mysql = require("mysql2");

// Database configuration with environment variables and resilient pool
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Rahulshewale",
  database: process.env.DB_NAME || "portfolio",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Verify initial connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("⚠️ MySQL Connection Error:", err.message);
  } else {
    console.log("MySQL Connected ✅");
    connection.release();
  }
});

module.exports = pool;
