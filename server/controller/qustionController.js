const assert = require('assert')
const bcrypt = require("bcryptjs")
const { StatusCodes } = require('http-status-codes')
const db = require('../db/database')
const idGenerator = require('../utils/idGenerator')
const questionController = {
   getAllQuestions: async (req, res) => {
     try {
       const query = 'SELECT * FROM question_table'
       db.query(query, (err, response) => {
         if (err) assert.deepStrictEqual(err, null);
         res.status(StatusCodes.OK).json({ msg: 'All questions data', data: response })
       })
     } catch (error) {
       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message })
     }
   },
   createQuestions: async (req, res) => {
    try {
      const reqBody = req.body;
  
      // Check if the question with the given text already exists
      db.query('SELECT * FROM question_table WHERE questionText = ?', [reqBody.questionText], async (err, response) => {
        if (err) {
          throw new Error(err.message);
        } else if (response.length > 0) {
          return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Question already exists with this text!' });
        } else {
          // Assuming you have a function to generate a unique question ID
          const newQuestionId = await idGenerator('question', 'question_table');
  
          // Ensure that the provided sectionID is a valid foreign key
          db.query('SELECT * FROM section_table WHERE sectionID = ?', [reqBody.sectionID], (err, sectionResponse) => {
            if (err) {
              throw new Error(err.message);
            } else if (sectionResponse.length === 0) {
              return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid sectionID. Section not found.' });
            } else {
              // Construct the question data
              const questionData = {
                questionID: newQuestionId,
                sectionID: reqBody.sectionID,
                questionText: reqBody.questionText,
                questionInputType: reqBody.questionInputType,
                exampleInput: reqBody.exampleInput,
              };
  
              // Insert the new question into the 'question_table' using parameterized query
              const query = 'INSERT INTO question_table SET ?';
              db.query(query, [questionData], (err, response) => {
                if (err) {
                  throw new Error(err.message);
                }
                return res.status(StatusCodes.OK).json({ msg: 'Question created successfully', data: questionData });
              });
            }
          });
        }
      }); 
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  },
   updateQuestion : async (req, res) => {
    try {
      const reqBody = req.body;
      const questionID = req.params.questionID; // Assuming the questionID is in the route params
  
      // Check if the question with the provided ID exists
      db.query('SELECT * FROM question_table WHERE questionID = ?', questionID, (err, question) => {
        if (err) {
          throw err;
        } else if (!question.length) {
          return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'No question present with provided questionID!' });
        } else {
          // Check if another question with the same text already exists (excluding the current question)
          db.query('SELECT * FROM question_table WHERE questionText = ? AND questionID != ?', [reqBody.questionText, questionID], (err, response) => {
            if (err) {
              throw err;
            } else if (response.length > 0) {
              return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Another question already exists with this text!' });
            } else {
              // Update the question in the question_table
              const updateQuery = 'UPDATE question_table SET ? WHERE questionID = ?';
              db.query(updateQuery, [reqBody, questionID], (err, updateResponse) => {
                if (err) {
                  throw err;
                } else {
                  // Retrieve the updated question data
                  db.query('SELECT * FROM question_table WHERE questionID = ?', questionID, (err, updatedQuestion) => {
                    if (err) {
                      throw err;
                    }
  
                    return res.status(StatusCodes.OK).json({ msg: 'Question data updated successfully', data: updatedQuestion[0] });
                  });
                }
              });
            }
          });
        }
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  
  
  // Use the updateQuestion function in your routes
  
  
  

  
 
 },
 deleteQuestion: async (req, res) => {
  try {
    const questionID = req.params.questionID; // Assuming the questionID is in the route params

    // Check if the question with the provided ID exists
    db.query('SELECT * FROM question_table WHERE questionID = ?', [questionID], (err, question) => {
      if (err) {
        throw err;
      } else if (!question.length) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'No question present with provided questionID!' });
      } else {
        // Delete the question from the question_table
        const deleteQuery = 'DELETE FROM question_table WHERE questionID = ?';
        db.query(deleteQuery, [questionID], (err, deleteResponse) => {
          if (err) {
            throw err;
          } else {
            return res.status(StatusCodes.OK).json({ msg: 'Question deleted successfully', data: question[0] });
          }
        });
      }
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }


// Use the deleteQuestion function in your routes

},
getQuestion:async(req,res)=>{
  try {
    const questionID = req.params.questionID; // Assuming the questionID is in the route params

    // Select a question from the question_table based on questionID
    const query = 'SELECT * FROM question_table WHERE questionID = ?';

    db.query(query, [questionID], (err, question) => {
      if (err) {
        throw err;
      }

      if (question.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Question not found' });
      }

      return res.status(StatusCodes.OK).json({ msg: 'Question retrieved successfully', data: question[0] });
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
}
};
module.exports  = questionController 