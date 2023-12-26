const predefinedValues = require('../utils/sectionNames')

const sectionTableCreation = (connection) => {
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

module.exports = sectionTableCreation