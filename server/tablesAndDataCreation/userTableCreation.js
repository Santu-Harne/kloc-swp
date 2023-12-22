const createAdminData = require('./createAdminData')
const userTableCreation = async (connection) => {
  return new Promise((resolve, reject) => {
    const userTableCreateQuery = `CREATE TABLE IF NOT EXISTS user_table(
      userId VARCHAR(50) UNIQUE PRIMARY KEY,
      userName VARCHAR(50) NOT NULL,
      userEmail VARCHAR(50) NOT NULL,
      userPassword VARCHAR(100) NOT NULL,
      userMobileNo VARCHAR(20) NOT NULL,
      userAltMobileNo VARCHAR(20),
      userRole VARCHAR(20) NOT NULL,
      userCompany VARCHAR(40) NOT NULL,
      userCountry VARCHAR(50) NOT NULL,
      userAddress VARCHAR(200) NOT NULL,
      userDesignation VARCHAR(40),
      userDepartment VARCHAR(40),
      userWebsiteUrl VARCHAR(100),
      userSocialMediaUrl VARCHAR(100),
      userFinalCommit BOOLEAN DEFAULT FALSE
  )`
    connection.query(userTableCreateQuery, async (err, result) => {
      if (err) {
        console.error('Error creating user_table:', err);
        reject(err);
      }
      else {
        if (result.warningStatus === 0) {
          console.log('user_table created');
          await createAdminData(connection)
        }
        resolve();
      }
    })
  })
}

module.exports = userTableCreation