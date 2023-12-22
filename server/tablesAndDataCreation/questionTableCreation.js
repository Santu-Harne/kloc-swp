const questionTableCreation = (connection) => {
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

module.exports = questionTableCreation