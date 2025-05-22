const mysql2 = require("mysql2/promise");

const db = mysql2.createPool({
  host: "localhost",
  database: "bookverse",
  user: "root",
  password: "",
});

module.exports = db;
