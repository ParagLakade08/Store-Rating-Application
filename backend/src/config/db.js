const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "kd2-Parag-92397",
  password: "manager",
  database: "store_rating_db",
});

module.exports = pool;
