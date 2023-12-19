const assert = require('assert');
const bcrypt = require("bcryptjs")
// const mysql = require('mysql');
const sendMail = require('./../middleware/mail')
const registerTemplate = require('./../templates/registerTemplate')
const mysql = require('mysql2');

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

      // Create all tables
      await createAllTables()

      //Create admin data
      createAdminData()

    } else {
      // connection.release();
      throw err;
    }
  } else {
    console.log(`connected to ${process.env.DB_NAME} database`);

    // Create all tables
    await createAllTables()
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
    newConnection.connect((err) => {
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
    })
  })
}
const createAllTables = async () => {
  //1 Create section_table in the new database
  await sectionTableCreation()

  //2 Create user_table in the new database
  await userTableCreation()

  //3 Create question_table in the new database
  await questionTableCreation()

  //4 Create clientResponse_table in the new database
  await clientResponseTableCreation()

  //5 Create competitionAnalysis_table in the new database
  await competitionAnalysisTableCreation()

  //6 Create coreCompetencyName_table in the new database
  await coreCompetencyNameTableCreation()

  //7 Create coreCompetencies_table in the new database
  await coreCompetenciesTableCreation()

}
const sectionTableCreation = () => {
  return new Promise((resolve, reject) => {
    const sectionTableCreateQuery = `CREATE TABLE IF NOT EXISTS section_table (
      sectionID varchar(50) PRIMARY KEY NOT NULL,
      sectionName varchar(50) DEFAULT NULL
    )`;
    connection.query(sectionTableCreateQuery, async (err, result) => {
      if (err) {
        console.error('Error creating section_table:', err);
        reject(err);
      } else {
        if (result.warningStatus === 0) {
          console.log('section_table created');
        }
        const checkQuery = 'SELECT COUNT(*) AS count FROM section_table WHERE sectionID IN (?)';
        const predefinedIds = ['section_0001', 'section_0002', 'section_0003', 'section_0004', 'section_0005', 'section_0006', 'section_0007',
          'section_0008', 'section_0009', 'section_0010', 'section_0011', 'section_0012', 'section_0013'];
        connection.query(checkQuery, [predefinedIds], (checkErr, checkResult) => {
          if (checkErr) {
            //console.error('Error checking for existing predefined values:', checkErr);
            reject(checkErr);
          } else {
            const existingCount = checkResult[0].count;
            if (existingCount === predefinedIds.length) {
              // console.log('Predefined values already exist in section_table');
              resolve();
            } else {
              // Insert predefined values into section_table
              const predefinedValues = [
                { sectionID: 'section_0001', sectionName: 'Executive Summary' },
                { sectionID: 'section_0002', sectionName: 'Vision Board' },
                { sectionID: 'section_0003', sectionName: 'Core Ideology' },
                { sectionID: 'section_0004', sectionName: 'Core Purpose' },
                { sectionID: 'section_0005', sectionName: 'Envisioned Future' },
                { sectionID: 'section_0006', sectionName: 'Vivid Description' },
                { sectionID: 'section_0007', sectionName: 'Big Hairy Audacious Goal' },
                { sectionID: 'section_0008', sectionName: 'Mission' },
                { sectionID: 'section_0009', sectionName: 'Consumer Understanding' },
                { sectionID: 'section_0010', sectionName: 'Super Understanding' },
                { sectionID: 'section_0011', sectionName: 'Services' },
                { sectionID: 'section_0012', sectionName: 'Competition' },
                { sectionID: 'section_0013', sectionName: 'Core Competency' },
              ];
              const insertValuesQuery = 'INSERT INTO section_table (sectionID, sectionName) VALUES ?';
              connection.query(insertValuesQuery, [predefinedValues.map((value) => [value.sectionID, value.sectionName])], (insertErr, insertResult) => {
                if (insertErr) {
                  console.error('Error inserting predefined values into section_table:', insertErr);
                  reject(insertErr);
                } else {
                  //console.log('Predefined values inserted into section_table');
                  resolve();
                }
              });
            }
          }
        });
      }
    });
  });
};
const userTableCreation = () => {
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
    connection.query(userTableCreateQuery, (err, result) => {
      if (err) {
        console.error('Error creating user_table:', err);
        reject(err);
      }
      else {
        if (result.warningStatus === 0) {
          console.log('user_table created');
        }
        resolve();
      }
    })
  })
}
const questionTableCreation = () => {
  return new Promise((resolve, reject) => {
    const questionTableCreateQuery = `CREATE TABLE IF NOT EXISTS question_table (
      questionID varchar(50) PRIMARY KEY NOT NULL,
      sectionID varchar(50) NOT NULL,
      questionText text,
      questionInputType text,
      exampleInput text,
      FOREIGN KEY (sectionId) REFERENCES section_table(sectionId)
      )`
    connection.query(questionTableCreateQuery, (err, result) => {
      if (err) {
        console.error('Error creating question_table:', err);
        reject(err);
      }
      else {
        if (result.warningStatus === 0) {
          console.log('question_table created');
        }
        resolve();
      }
    })
  })
}
const clientResponseTableCreation = () => {
  return new Promise((resolve, reject) => {
    const clientResponseTableCreateQuery = `CREATE TABLE IF NOT EXISTS clientResponse_table (
          clientResponseId VARCHAR(50) PRIMARY KEY NOT NULL,
          questionId VARCHAR(50) NOT NULL,
          userId VARCHAR(50) NOT NULL,
          clientInput text,
          comments text,
          klocInput text,
          FOREIGN KEY (questionId) REFERENCES question_table(questionId),
          FOREIGN KEY (userId) REFERENCES user_table(userId)
          )`
    connection.query(clientResponseTableCreateQuery, (err, result) => {
      if (err) {
        console.error('Error creating clientResponse_table:', err);
        reject(err);
      }
      else {
        if (result.warningStatus === 0) {
          console.log('clientResponse_table created');
        }
        resolve();
      }
    })
  });
}
const competitionAnalysisTableCreation = () => {
  return new Promise((resolve, reject) => {
    const competitionAnalysisTableCreateQuery = `CREATE TABLE IF NOT EXISTS competitiveAnalysis_table (
      competitiveName TEXT,
      competitiveAnalysisId VARCHAR(50) PRIMARY KEY NOT NULL,
      companyProfile TEXT,
      keyCompetitiveAdvantage TEXT,
      targetMarket TEXT,
      marketingStrategy TEXT,
      productPricing TEXT,
      productsAndServices TEXT,
      strengths TEXT,
      weaknesses TEXT,
      opportunities TEXT,
      threats TEXT,
      klocInput TEXT,
      userId VARCHAR(50) NOT NULL,
      FOREIGN KEY ( userId) REFERENCES user_table ( userId)
      )`
    connection.query(competitionAnalysisTableCreateQuery, (err, result) => {
      if (err) {
        console.error('Error creating competitionAnalysis_table:', err);
        reject(err);
      }
      else {
        if (result.warningStatus === 0) {
          console.log('competitionAnalysis_table created');
        }
        resolve();
      }
    })
  })
}

const coreCompetencyNameTableCreation = () => {
  return new Promise((resolve, reject) => {
    const coreCompetencyNameTableCreateQuery = `CREATE TABLE IF NOT EXISTS coreCompetencyName_table (
      coreCompetencyNameId  VARCHAR(50) PRIMARY KEY NOT NULL,
      coreCompetencyName TEXT,
      coreCompetencyDescription TEXT
      )`;

    connection.query(coreCompetencyNameTableCreateQuery, async (err, result) => {
      if (err) {
        console.error('Error creating coreCompetencyName_table:', err);
        reject(err);
      } else {
        if (result.warningStatus === 0) {
          console.log('coreCompetencyName_table created');
        }

        // Add predefined values if they don't already exist
        const checkQuery = 'SELECT COUNT(*) AS count FROM coreCompetencyName_table WHERE coreCompetencyNameId IN (?)';
        const predefinedIds = ['coreCompetencyName_0001','coreCompetencyName_0002','coreCompetencyName_0003','coreCompetencyName_0004'];

        connection.query(checkQuery, [predefinedIds], (checkErr, checkResult) => {
          if (checkErr) {
            console.error('Error checking for existing predefined values:', checkErr);
            reject(checkErr);
          } else {
            const existingCount = checkResult[0].count;

            if (existingCount === predefinedIds.length) {
              //console.log('Predefined values already exist in coreCompetencyName_table');
              resolve();
            } else {
              // Insert predefined values into coreCompetencyName_table
              const predefinedValues = [
                { coreCompetencyNameId: 'coreCompetencyName_0001', coreCompetencyName: 'High Quality Reliable services', coreCompetencyDescription: '' },
                { coreCompetencyNameId: 'coreCompetencyName_0002', coreCompetencyName: 'Ability to upsell', coreCompetencyDescription: '' },
                { coreCompetencyNameId: 'coreCompetencyName_0003', coreCompetencyName: 'Ability ot generate word of mouth', coreCompetencyDescription: '' },
                { coreCompetencyNameId: 'coreCompetencyName_0004', coreCompetencyName: 'Retain high quality cleaning staff', coreCompetencyDescription: '' },
              ];

              const insertValuesQuery = 'INSERT INTO coreCompetencyName_table (coreCompetencyNameId, coreCompetencyName, coreCompetencyDescription) VALUES ?';
              connection.query(insertValuesQuery, [predefinedValues.map((value) => [value.coreCompetencyNameId, value.coreCompetencyName, value.coreCompetencyDescription])], (insertErr, insertResult) => {
                if (insertErr) {
                  console.error('Error inserting predefined values into coreCompetencyName_table:', insertErr);
                  reject(insertErr);
                } else {
                  console.log('Predefined values inserted into coreCompetencyName_table');
                  resolve();
                }
              });
            }
          }
        });
      }
    });
  });
};

const coreCompetenciesTableCreation = () => {
  return new Promise((resolve, reject) => {
    const coreCompetenciesTableCreateQuery = `CREATE TABLE IF NOT EXISTS coreCompetencies_table (
      coreCompetenciesId  VARCHAR(50) PRIMARY KEY NOT NULL,
      userId VARCHAR(50) NOT NULL,
      coreCompetencyNameId  VARCHAR(50)  NOT NULL,
      coreCompetencyNameId  VARCHAR(50)  NOT NULL,
      description TEXT,
      importance TEXT,
      defensibility TEXT,
      klocInput TEXT,
      FOREIGN KEY (coreCompetencyNameId) REFERENCES coreCompetencyName_table(coreCompetencyNameId),
      FOREIGN KEY (coreCompetencyNameId) REFERENCES coreCompetencyName_table(coreCompetencyNameId),
      FOREIGN KEY (userId) REFERENCES user_table(userId)
      )`
    connection.query(coreCompetenciesTableCreateQuery, (err, result) => {
      if (err) {
        console.error('Error creating coreCompetencies_table:', err);
        reject(err);
      }
      else {
        if (result.warningStatus === 0) {
          console.log('coreCompetencies_table created');
        }
        resolve();
      }
    })
  })
}
const createAdminData = () => {
  connection.query(`SELECT * FROM user_table`, async (err, response) => {
    if (err) {
      throw err;
    }
    else if (response.length === 0) {
      const userData = {
        userId: 'user_0001',
        userName: "Santosh",
        userEmail: "santosh.283143@gmail.com",
        userPassword: await bcrypt.hash('Santosh1437$', 10),
        userRole: 'admin',
        userMobileNo: "8660822483",
        userAltMobileNo: "",
        userCompany: "klocTechnologies",
        userCountry: "India",
        userAddress: "Bangalore",
        userDesignation: "Developer",
        userDepartment: "Frontend",
        userWebsiteUrl: "www.google.com",
        userSocialMediaUrl: "www.facebook.com",
        userFinalCommit: false
      }
      connection.query('INSERT INTO user_table SET ?', userData, (err, response) => {
        if (err) {
          // Handle error during database creation
          console.error('Error creating adminData:', err);
        }
        else {
          const subject = 'Confirmation of registration with KLOC-SWP'
          const template = registerTemplate(userData.userName, userData.userEmail, 'Santosh1437$')
          sendMail(userData.userEmail, subject, template)
          console.log('admin data created successfully!');
        }
      })
    }
  })
}


// Export the connection
module.exports = connection;
