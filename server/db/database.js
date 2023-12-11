const assert = require('assert');
const mysql = require('mysql');

// Connection configuration
const connectionConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: '',
    database: process.env.DB_NAME
};

// Create a connection
const connection = mysql.createConnection(connectionConfig);

// Connect to the MySQL server
connection.connect((err) => {
    if (err) {
        if (err.sqlMessage === `Unknown database 'strategyworkshopdb'`) {
            // createDatabaseAndTable();
        } else {
            assert.deepStrictEqual(err, null);
        }
    } else {
        console.log(`Connected to ${process.env.DB_NAME} database`);
        // You can perform other operations here if needed
    }
});

// Function to create the database and table
function createDatabaseAndTable() {
    connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err) => {
        if (err) throw err;

        console.log(`${process.env.DB_NAME} database created`);

        // Use the created database
        connection.query(`USE ${process.env.DB_NAME}`, (err) => {
            if (err) throw err;

            // Create a table if it doesn't exist
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS user_table (
                    userId VARCHAR(50) UNIQUE PRIMARY KEY,
                    userName VARCHAR(50) NOT NULL,
                    userEmail VARCHAR(50) NOT NULL,
                    userPassword VARCHAR(20) NOT NULL,
                    userMobileNo BIGINT NOT NULL,
                    userAltMobileNo BIGINT,
                    userRole VARCHAR(20) NOT NULL,
                    userCompany VARCHAR(40) NOT NULL,
                    userCountry VARCHAR(50) NOT NULL,
                    userAddress VARCHAR(200) NOT NULL,
                    userDesignation VARCHAR(40),
                    userDepartment VARCHAR(40),
                    userWebsiteUrl VARCHAR(100),
                    userSocialMediaUrl VARCHAR(100)
                )`;

            connection.query(createTableQuery, (err) => {
                if (err) throw err;

                console.log('user_table table created');

                // Perform other database operations here

                // Close the connection after all operations
                connection.end((err) => {
                    if (err) throw err;
                    console.log('Connection closed');
                });
            });
        });
    });
}

// Export the connection
module.exports = connection;
