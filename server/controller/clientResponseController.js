const assert = require('assert')
const bcrypt = require("bcryptjs")
const { StatusCodes } = require('http-status-codes')
const db = require('../db/database')
const idGenerator = require('../utils/idGenerator')
const selectUserIdQuery = 'SELECT * FROM user_table WHERE userId = ?';
const selectQuestionQuery = 'SELECT * FROM question_table WHERE questionId = ?';
const selectClientResponseQuery = 'SELECT * FROM clientresponse_table WHERE questionId = ? AND userId = ?';
const insertClientResponseQuery = 'INSERT INTO clientresponse_table VALUES (?, ?, ?, ?, ?, ?)';
const updateClientResponseQuery = 'UPDATE clientresponse_table SET clientInput=?, comments=?, klocInput=? WHERE questionId=? AND userId=?';
const clientResponseController = {
  getAllClientResponses: async (req, res) => {
    try {
      // Fetch all columns from the 'user_table'
      const userColumnsQuery = 'SHOW COLUMNS FROM user_table';
      const [userColumnsResult] = await db.promise().query(userColumnsQuery);
      const userColumns = userColumnsResult.map(column => column.Field);
  
      const questionColumnsQuery = 'SHOW COLUMNS FROM question_table';
      const [questionColumnsResult] = await db.promise().query(questionColumnsQuery);
      const questionColumns = questionColumnsResult.map(column => column.Field);
  
      // Construct the user JSON object dynamically
      const userJsonObject = userColumns.map(column => `'${column}', u.${column}`).join(',\n');
      
      // Construct the question JSON object dynamically
      const questionJsonObject = questionColumns.map(column => `'${column}', q.${column}`).join(',\n');
  
      const query = `
        SELECT 
          cr.*,
          JSON_OBJECT(
            ${userJsonObject}
          ) AS user,
          JSON_OBJECT(
            ${questionJsonObject}
          ) AS question
        FROM clientresponse_table cr
        JOIN user_table u ON cr.userId = u.userId
        JOIN question_table q ON cr.questionId = q.questionId
      `;
  
      const [result] = await db.promise().query(query);
  
      return res.status(StatusCodes.OK).json({ msg: 'All clientResponse data', data: result });
    } catch (error) {
      console.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
    }
  },
  

 
  
  
  createClientResponse: async (req, res) => {
    try {
      const userId = req.params.userId;
      let clientResponseDataArray = req.body;
  
      // Check if clientResponseDataArray is an array; if not, convert it to an array
      if (!Array.isArray(clientResponseDataArray)) {
        clientResponseDataArray = [clientResponseDataArray];
      }
  
      const userResp = await new Promise((resolve, reject) => {
        db.query(selectUserIdQuery, userId, (userErr, userResp) => {
          if (userErr) {
            reject(userErr);
          } else {
            resolve(userResp);
          }
        });
      });
  
      if (userResp.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'User not found.' });
      }
  
      if (!clientResponseDataArray || clientResponseDataArray.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid or empty request body.' });
      }
  
      let errCount = 0;
      let successCount = 0;
  
      for (const clientResponseData of clientResponseDataArray) {
        try {
          const { questionId, clientInput, comments, klocInput } = clientResponseData;
  
          const existingClientResponse = await new Promise((resolve, reject) => {
            db.query(selectClientResponseQuery, [questionId, userId], (clientResponseErr, clientResponseRes) => {
              if (clientResponseErr) {
                reject(clientResponseErr);
              } else {
                resolve(clientResponseRes);
              }
            });
          });
  
          if (existingClientResponse.length === 0) {
            // If no existing record, create a new one
            const newId = await idGenerator('clientresponse', 'clientresponse_table');
            const queryValues = [newId, questionId, userId, clientInput, comments, klocInput];
            await new Promise((resolve, reject) => {
              db.query(insertClientResponseQuery, queryValues, (err, response) => {
                if (err) {
                  errCount += 1;
                  reject(err);
                } else {
                  successCount += 1;
                  resolve(response);
                }
              });
            });
          } else {
            // If an existing record is found, update it
            const queryValues = [clientInput, comments, klocInput, questionId, userId];
            await new Promise((resolve, reject) => {
              db.query(updateClientResponseQuery, queryValues, (err, response) => {
                if (err) {
                  errCount += 1;
                  reject(err);
                } else {
                  successCount += 1;
                  resolve(response);
                }
              });
            });
          }
        } catch (error) {
          console.error('Error in loop:', error);
          errCount += 1;
        }
      }
  
      if (successCount === clientResponseDataArray.length) {
        return res.status(StatusCodes.OK).json({ msg: 'Client response data processed successfully', data: clientResponseDataArray });
      } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
      }
    } catch (err) {
      console.error(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
    }
  },
  
  // getclientResponse
  getAllClientResponsesByUserId: async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Ensure that the provided userId is a valid foreign key
      db.query('SELECT * FROM user_table WHERE userId = ?', [userId], async (err, userResponse) => {
        if (err) {
          throw new Error(err.message);
        } else if (userResponse.length === 0) {
          return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid userId. User not found.' });
        } else {
          // Fetch all columns from the 'question_table'
          const questionColumnsQuery = 'SHOW COLUMNS FROM question_table';
          const [questionColumnsResult] = await db.promise().query(questionColumnsQuery);
          const questionColumns = questionColumnsResult.map(column => column.Field);
  
          // Construct the question JSON object dynamically
          const questionJsonObject = questionColumns.map(column => `'${column}', q.${column}`).join(',\n');
  
          // Fetch all client responses for the given userId along with question and section details
          const query = `
            SELECT 
              cr.*,
              JSON_OBJECT(
                ${questionJsonObject},
                'section', JSON_OBJECT(
                  'sectionId', s.sectionId,
                  'sectionName', s.sectionName
                  -- Add other section fields as needed
                )
                -- Add other question fields as needed
              ) AS question
            FROM clientresponse_table cr
            JOIN question_table q ON cr.questionId = q.questionId
            JOIN section_table s ON q.sectionId = s.sectionId
            WHERE cr.userId = ?;
          `;
  
          db.query(query, [userId], (err, clientResponses) => {
            if (err) {
              throw new Error(err.message);
            }
  
            const responseData = {
              msg: 'All client responses for the user',
              user: userResponse[0],
              data: clientResponses,
            };
  
            return res.status(StatusCodes.OK).json(responseData);
          });
        }
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  },
  
  getClientResponsesByUserIdAndQuestionId: async (req, res) => {
    try {
      const userId = req.params.userId;
      const questionId = req.params.questionId;
  
      // Ensure that the provided userId is a valid foreign key
      db.query('SELECT * FROM clientresponse_table WHERE userId = ?', [userId], async (err, userResponse) => {
        if (err) {
          throw new Error(err.message);
        } else if (userResponse.length === 0) {
          return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid userId. User not found.' });
        } else {
          // Fetch data from the client response, question, and section tables
          const query = `
            SELECT 
              cr.*,
              JSON_OBJECT('questionId', q.questionId, 'questionText', q.questionText, 'questionInputType', q.questionInputType, 'exampleInput', q.exampleInput, 'section', JSON_OBJECT('sectionId', s.sectionId, 'sectionName', s.sectionName)) AS question
            FROM clientresponse_table cr
            JOIN question_table q ON cr.questionId = q.questionId
            JOIN section_table s ON q.sectionId = s.sectionId
            WHERE cr.userId = ? AND cr.questionId = ?
          `;
  
          db.query(query, [userId, questionId], (err, result) => {
            if (err) {
              throw new Error(err.message);
            }
  
            const responseData = {
              msg: 'Client responses for the user and question',
              user: userResponse[0],
              data: result,
            };
  
            return res.status(StatusCodes.OK).json(responseData);
          });
        }
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  },
  
  
  
   
  // Use the createClientResponse function in your routes



  updateClientResponse: async (req, res) => {
    try {
      const reqBody = req.body;
      const clientResponseID = req.params.clientResponseId; // Assuming the clientresponseID is in the route params
  
      // Check if the client response with the provided ID exists
      db.query('SELECT * FROM clientresponse_table WHERE clientResponseID = ?', clientResponseID, (err, clientResponse) => {
        if (err) {
          throw new Error(err.message);
        } else if (clientResponse.length === 0) {
          return res.status(StatusCodes.NOT_FOUND).json({ msg: 'No client response found with provided clientresponseID!' });
        } else {
          // Ensure that the provided questionId is a valid foreign key
          db.query('SELECT * FROM question_table WHERE questionId = ?', [reqBody.questionId], (err, questionResponse) => {
            if (err) {
              throw new Error(err.message);
            } else if (questionResponse.length === 0) {
              return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid questionId. Question not found.' });
            } else {
              // Ensure that the provided userId is a valid foreign key
              db.query('SELECT * FROM user_table WHERE userId = ?', [reqBody.userId], (err, userResponse) => {
                if (err) {
                  throw new Error(err.message);
                } else if (userResponse.length === 0) {
                  return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid userId. User not found.' });
                } else {
                  // Update the client response in the clientresponse_table
                  const updateQuery = 'UPDATE clientresponse_table SET ? WHERE clientresponseID = ?';
                  db.query(updateQuery, [reqBody, clientResponseID], (err, updateResponse) => {
                    if (err) {
                      throw new Error(err.message);
                    } else {
                      // Retrieve the updated client response data
                      db.query('SELECT * FROM clientresponse_table WHERE clientResponseID = ?', clientResponseID, (err, updatedClientResponse) => {
                        if (err) {
                          throw new Error(err.message);
                        }
  
                        return res.status(StatusCodes.OK).json({
                          msg: 'Client response data updated successfully',
                          data: updatedClientResponse[0],
                        });
                      });
                    }
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
  },
  
  deleteClientResponse: async (req, res) => {
    try {
      const clientresponseID = req.params.clientresponseID; // Assuming the clientresponseID is in the route params
      const userId = req.params.userId; // Assuming the userId is in the route params
  
      // Check if the client response with the provided ID and user ID exists
      db.query('SELECT * FROM clientresponse_table WHERE clientresponseID = ? AND userId = ?', [clientresponseID, userId], (err, clientResponse) => {
        if (err) {
          throw new Error(err.message);
        } else if (clientResponse.length === 0) {
          return res.status(StatusCodes.NOT_FOUND).json({ msg: 'No client response found with provided clientresponseID and userId!' });
        } else {
          // Delete the client response from the clientresponse_table
          const deleteQuery = 'DELETE FROM clientresponse_table WHERE clientresponseID = ? AND userId = ?';
          db.query(deleteQuery, [clientresponseID, userId], (err, deleteResponse) => {
            if (err) {
              throw new Error(err.message);
            }
  
            return res.status(StatusCodes.OK).json({ msg: 'Client response deleted successfully' });
          });
        }
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  },
  
    getClientResponse: async (req, res) => {
      try {
        const clientresponseID = req.params.clientresponseID; // Assuming the clientresponseID is in the route params
    
        // Query the clientresponse_table by clientresponseID
        db.query('SELECT * FROM clientresponse_table WHERE clientresponseID = ?', clientresponseID, (err, response) => {
          if (err) {
            throw new Error(err.message);
          }
    
          if (response.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: 'No client response found with provided clientresponseID!' });
          } else {
            const clientresponse = response[0];
            return res.status(StatusCodes.OK).json({ msg: 'Client response retrieved successfully', data: clientresponse });
          }
        });
      } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
      }
    }
}
module.exports = clientResponseController