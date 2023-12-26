const predefinedQuestionNames=require('./../utils/qustiondata')

const questionTableCreation = (connection) => {
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

module.exports = questionTableCreation