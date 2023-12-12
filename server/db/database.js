const assert = require('assert');
const mysql = require('mysql');

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

    } else {
      // connection.release();
      throw err;
    }
  } else {
    console.log(`Connected to ${process.env.DB_NAME} database`);
    // You can perform other operations here if needed
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

  //6 Create coreCompetencies_table in the new database
  await coreCompetenciesTableCreation()
}
const sectionTableCreation = () => {
  return new Promise((resolve, reject) => {
    const sectionTableCreateQuery = `CREATE TABLE section_table (
      sectionID varchar(50) PRIMARY KEY NOT NULL,
      sectionName varchar(50) DEFAULT NULL
      )`
    connection.query(sectionTableCreateQuery, (err) => {
      if (err) {
        console.error('Error creating section_table:', err);
        reject(err);
      }
      else {
        console.log('Created section_table');
        resolve();
      }
    })
  })

}
const userTableCreation = () => {
  return new Promise((resolve, reject) => {
    const userTableCreateQuery = `CREATE TABLE user_table(
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
      userSocialMediaUrl VARCHAR(100),
      userFinalCommit BOOLEAN NOT NULL
  )`
    connection.query(userTableCreateQuery, (err) => {
      if (err) {
        console.error('Error creating user_table:', err);
        reject(err);
      }
      else {
        console.log('Created user_table');
        resolve();
      }
    })
  })
}
const questionTableCreation = () => {
  return new Promise((resolve, reject) => {
    const questionTableCreateQuery = `CREATE TABLE question_table (
      questionID varchar(50) PRIMARY KEY NOT NULL,
      sectionID varchar(50) NOT NULL,
      questionText text,
      questionInputType text,
      exampleInput text,
      FOREIGN KEY (sectionId) REFERENCES section_table(sectionId)
      )`
    connection.query(questionTableCreateQuery, (err) => {
      if (err) {
        console.error('Error creating question_table:', err);
        reject(err);
      }
      else {
        console.log('Created question_table');
        resolve();
      }
    })
  })

}
const clientResponseTableCreation = () => {
  return new Promise((resolve, reject) => {
    const clientResponseTableCreateQuery = `CREATE TABLE clientResponse_table (
          clientResponseId VARCHAR(50) PRIMARY KEY NOT NULL,
          questionId VARCHAR(50) NOT NULL,
          userId VARCHAR(50) NOT NULL,
          clientInput text,
          comments text,
          klocInput text,
          FOREIGN KEY (questionId) REFERENCES question_table(questionId),
          FOREIGN KEY (userId) REFERENCES user_table(userId)
          )`
    connection.query(clientResponseTableCreateQuery, (err) => {
      if (err) {
        console.error('Error creating clientResponse_table:', err);
        reject(err);
      }
      else {
        console.log('Created clientResponse_table');
        resolve();
      }
    })
  });
}
const competitionAnalysisTableCreation = () => {
  return new Promise((resolve, reject) => {
    const competitionAnalysisTableCreateQuery = `CREATE TABLE competitionAnalysis_table (
      competitionName TEXT,
      competitionAnalysisId VARCHAR(50) PRIMARY KEY NOT NULL,
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
      userId VARCHAR(50) NOT NULL,
      FOREIGN KEY ( userId) REFERENCES user_table ( userId)
      )`
    connection.query(competitionAnalysisTableCreateQuery, (err) => {
      if (err) {
        console.error('Error creating competitionAnalysis_table:', err);
        reject(err);
      }
      else {
        console.log('Created competitionAnalysis_table');
        resolve();
      }
    })
  })
}
const coreCompetencyNameTableCreation = () => {
  return new Promise((resolve, reject) => {
    const coreCompetencyNameTableCreateQuery = `CREATE TABLE coreCompetencyName_table (
      coreCompetencyId  VARCHAR(50) PRIMARY KEY NOT NULL,
      competencyName TEXT,
      competencyDescription TEXT
      )`
    connection.query(coreCompetencyNameTableCreateQuery, (err) => {
      if (err) {
        console.error('Error creating coreCompetencyName_table:', err);
        reject(err);
      }
      else {
        console.log('Created coreCompetencyName_table');
        resolve();
      }
    })
  })
}
const coreCompetenciesTableCreation = () => {
  return new Promise((resolve, reject) => {
    const coreCompetenciesTableCreateQuery = `CREATE TABLE coreCompetencies_table (
      competencyId  VARCHAR(50) PRIMARY KEY NOT NULL,
      userId VARCHAR(50) NOT NULL,
      coreCompetencyId  VARCHAR(50)  NOT NULL,
      description TEXT,
      importance TEXT,
      defensibility TEXT,
      klocInput TEXT,
      FOREIGN KEY (coreCompetencyId) REFERENCES coreCompetencyName_table(coreCompetencyId),
      FOREIGN KEY (userId) REFERENCES user_table(userId)
      )`
    connection.query(coreCompetenciesTableCreateQuery, (err) => {
      if (err) {
        console.error('Error creating coreCompetencies_table:', err);
        reject(err);
      }
      else {
        console.log('Created coreCompetencies_table');
        resolve();
      }
    })
  })
}


// Export the connection
module.exports = connection;
