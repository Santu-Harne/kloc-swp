const assert = require("assert");
const mysql = require("mysql");

// connection string
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.DB_NAME,
});

//connect function
connection.connect(function (err) {
  if (err) assert.deepStrictEqual(err, null);
  console.log(`Connected to ${process.env.DB_NAME} database`);
});
//hi
module.exports = connection;
