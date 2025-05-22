// const {createPool} = require("mysql2")
const mysql2 = require("mysql2");

const pool = mysql2
  .createPool({
    host: "localhost",
    database: "bookverse",
    user: "root",
    password: "",
  })
  .promise();

module.exports = pool;
