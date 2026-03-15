const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "secondhand_db",
  port: 3307,
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = db;