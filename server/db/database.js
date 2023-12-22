const assert = require('assert');
const bcrypt = require("bcryptjs")
// const mysql = require('mysql');
const sendMail = require('./../middleware/mail')
const registerTemplate = require('./../templates/registerTemplate')
const mysql = require('mysql2');
const adminData = require('./../utils/adminData')
const predefinedValues = require('./../utils/sectionNames')
const predefinedCoreCompetencyNames = require('./../utils/coreCompetencyNames')
const  predefinedQuestionNames = require('../utils/qustiondata')
// const idGenerator = require('../utils/idGenerator');
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
      sectionId varchar(50) PRIMARY KEY NOT NULL,
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

        // Check if predefined values already exist
        const checkQuery = 'SELECT COUNT(*) AS count FROM section_table WHERE sectionID IN (?)';
        const predefinedIds = predefinedValues.map(value => value.sectionID);

        connection.query(checkQuery, [predefinedIds], (checkErr, checkResult) => {
          if (checkErr) {
            reject(checkErr);
          } else {
            const existingCount = checkResult[0].count;

            if (existingCount === predefinedIds.length) {
             // console.log('Predefined values already exist in section_table');
              resolve();
            } else {
              // Insert predefined values into section_table
              const insertValuesQuery = 'INSERT INTO section_table (sectionID, sectionName) VALUES ?';
              connection.query(insertValuesQuery, [predefinedValues.map(value => [value.sectionID, value.sectionName])], (insertErr, insertResult) => {
                if (insertErr) {
                  console.error('Error inserting predefined values into section_table:', insertErr);
                  reject(insertErr);
                } else {
                  console.log('Predefined values inserted into section_table');
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
// const questionTableCreation = () => {
//   return new Promise((resolve, reject) => {
//     const questionTableCreateQuery = `CREATE TABLE IF NOT EXISTS question_table (
//       questionId varchar(50) PRIMARY KEY NOT NULL,
//       sectionId varchar(50) NOT NULL,
//       questionText text,
//       questionInputType text,
//       exampleInput text,
//       FOREIGN KEY (sectionId) REFERENCES section_table(sectionId)
//       )`
//     connection.query(questionTableCreateQuery, (err, result) => {
//       if (err) {
//         console.error('Error creating question_table:', err);
//         reject(err);
//       }
//       else {
//         if (result.warningStatus === 0) {
//           console.log('question_table created');
//         }
//         resolve();
//       }
//     })
//   })
// }
 // Adjust the path as needed


 
const questionTableCreation = () => {
  return new Promise((resolve, reject) => {
    const questionTableCreateQuery = `CREATE TABLE IF NOT EXISTS question_table (
      questionId VARCHAR(50) PRIMARY KEY NOT NULL,
      questionText TEXT,
      questionInputType VARCHAR(50),
      exampleInput TEXT,
      sectionId VARCHAR(50) NOT NULL,
      FOREIGN KEY (sectionId) REFERENCES section_table(sectionId)
    )`;
 
    connection.query(questionTableCreateQuery, async (err, result) => {
      if (err) {
        console.error('Error creating question_table:', err);
        reject(err);
      } else {
        if (result.warningStatus === 0) {
          console.log('question_table created');
        }

        // Check if predefined values already exist
        const checkQuery = 'SELECT COUNT(*) AS count FROM question_table WHERE questionId IN (?)';
        const predefinedValues = predefinedQuestionNames.flatMap(section =>
          section.questionData.map(question => [
            question.questionId,
            question.questionText,
            question.questionInputType,
            question.exampleInput,
            section.sectionId // Access sectionId directly from the section object
          ])
        );

        connection.query(checkQuery, [predefinedValues.map(value => value[0])], (checkErr, checkResult) => {
          if (checkErr) {
            reject(checkErr);
          } else {
            const existingCount = checkResult[0].count;

            if (existingCount === predefinedValues.length) {
              // console.log('Predefined values already exist in question_table');
              resolve();
            } else {
              // Insert predefined values into question_table
              const insertValuesQuery =
                'INSERT INTO question_table (questionId, questionText, questionInputType, exampleInput, sectionId) VALUES ?';

              connection.query(insertValuesQuery, [predefinedValues], (insertErr, insertResult) => {
                if (insertErr) {
                  console.error('Error inserting predefined values into question_table:', insertErr);
                  reject(insertErr);
                } else {
                  console.log('Predefined values inserted into question_table');
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

 
 // Call the function when your application starts
 questionTableCreation()
   .then(() => {
     // Continue with other setup or start your application logic
   })
   .catch((error) => {
     console.error('Error during startup:', error);
     // Handle startup error
   });
 


// // Call the function when your application starts
// questionTableCreation()
//   .then(() => {
//     // Continue with other setup or start your application logic
//   })
//   .catch((error) => {
//     console.error('Error during startup:', error);
//     // Handle startup error
//   });

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

        // Check if predefined values already exist
        const checkQuery = 'SELECT COUNT(*) AS count FROM coreCompetencyName_table WHERE coreCompetencyNameId IN (?)';
        const predefinedIds = predefinedCoreCompetencyNames.map(value => value.coreCompetencyNameId);

        connection.query(checkQuery, [predefinedIds], (checkErr, checkResult) => {
          if (checkErr) {
            reject(checkErr);
          } else {
            const existingCount = checkResult[0].count;

            if (existingCount === predefinedIds.length) {
             // console.log('Predefined values already exist in coreCompetencyName_table');
              resolve();
            } else {
              // Insert predefined values into coreCompetencyName_table
              const insertValuesQuery = 'INSERT INTO coreCompetencyName_table (coreCompetencyNameId, coreCompetencyName, coreCompetencyDescription) VALUES ?';
              const predefinedValues = predefinedCoreCompetencyNames.map(value => [value.coreCompetencyNameId, value.coreCompetencyName, value.coreCompetencyDescription]);

              connection.query(insertValuesQuery, [predefinedValues], (insertErr, insertResult) => {
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
      description TEXT,
      importance TEXT,
      defensibility TEXT,
      klocInput TEXT,
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

      const hashedAdminData = await Promise.all(adminData.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.userPassword, 10);
        return { ...user, userPassword: hashedPassword };
      }));

      const values = hashedAdminData.map(user => Object.values(user));
      const columns = Object.keys(hashedAdminData[0]);

      const placeholders = values.map(() => `(${columns.map(() => '?').join(', ')})`).join(', ');

      const query = `INSERT INTO user_table (${columns.join(', ')}) VALUES ${placeholders}`;

      connection.query(query, values.flat(), (err, response) => {
        if (err) {
          // Handle error during database creation
          console.error('Error creating adminData:', err);
        } else {
          const subject = 'Confirmation of registration with KLOC-SWP';
          adminData.forEach(user => {
            const template = registerTemplate(user.userName, user.userEmail, user.userPassword,);
            sendMail(user.userEmail, subject, template)
          })
          console.log('admin data created successfully!');
        }
      });

    }
  })
}


// Export the connection
module.exports = connection;
