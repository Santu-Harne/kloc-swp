const assert = require('assert');
const mysql = require('mysql2');
const createAllTables = require('../tablesAndDataCreation/createAllTables')

//  Create a connection
const connection = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the MySQL server
connection.getConnection(async (err, connection) => {
  if (err) {
    // Handle connection error
    if (err.code === 'ER_BAD_DB_ERROR') {
      // Create a new database
      await createDatabase();

    } else {
      // connection.release();
      throw err;
    }
  } else {
    console.log(`connected to ${process.env.DB_NAME} database`);

    // Create all tables
    await createAllTables(connection)
  }
});

// Functions to create the database and tables
const createDatabase = async () => {
  return new Promise((resolve, reject) => {
    const newConnection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    newConnection.connect(async (err) => {
      if (err) {
        // Handle connection error for the new connection
        console.error('Error connecting to MySQL for creating database:', err);
        newConnection.end();
        return;
      }

      newConnection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, async (err) => {
        if (err) {
          // Handle error during database creation
          console.error('Error creating database:', err);
          newConnection.end();
          reject(err);
        }
        else {
          console.log(`${process.env.DB_NAME} database created!`);
          resolve();
        }
      });
      // Create all tables
      await createAllTables(connection)
    })
  })
}




// Export the connection
module.exports = connection;
