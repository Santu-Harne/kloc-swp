const predefinedCoreCompetencyNames = require('./../utils/coreCompetencyNames')

const coreCompetencyNameTableCreation = (connection) => {
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

module.exports = coreCompetencyNameTableCreation