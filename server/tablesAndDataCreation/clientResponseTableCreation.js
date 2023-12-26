

const clientResponseTableCreation = (connection) => {
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
module.exports = clientResponseTableCreation