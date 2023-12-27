
const coreCompetenciesTableCreation = (connection) => {
  return new Promise((resolve, reject) => {
    const coreCompetenciesTableCreateQuery = `CREATE TABLE IF NOT EXISTS coreCompetencies_table (
      coreCompetenciesId  VARCHAR(50) PRIMARY KEY NOT NULL,
      userId VARCHAR(50) NOT NULL,
      coreCompetencyNameId  VARCHAR(50)  NOT NULL,
      description TEXT,
      importance TEXT,
      defensability TEXT,
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

module.exports = coreCompetenciesTableCreation