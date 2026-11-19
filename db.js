
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 4000),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "sys",

  ssl: {
    ca: fs.readFileSync(
      path.join(__dirname, "isrgrootx1.pem")
    ),
    minVersion: "TLSv1.2"
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

pool.getConnection((err, connection) => {
  if (err) {
    console.error("MySQL Connection Error:", err.message);
  } else {
    console.log("TiDB Connected Successfully!");
    connection.release();
  }
});

module.exports = pool;
