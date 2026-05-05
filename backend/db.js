require("dotenv").config();

const { Pool } = require("pg");

console.log("DB PASSWORD:", process.env.DB_PASSWORD); // 🔥 debug

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD), // ✅ FORCE STRING
  port: Number(process.env.DB_PORT),
});

module.exports = pool;