const assert = require('assert')
const bcrypt = require("bcryptjs")
const { StatusCodes } = require('http-status-codes')
const db = require('../db/database')
const idGenerator = require('../utils/idGenerator')
const clientResponseController = {
   getAllClientResponses: async (req, res) => {
      try {
        const query = 'SELECT * FROM clientresponse_table'
        db.query(query, (err, response) => {
          if (err) assert.deepStrictEqual(err, null);
          res.status(StatusCodes.OK).json({ msg: 'All clientResponse data', data: response })
        })
      } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message })
      }
    },

    createClientResponse :async (req, res) => {  
      try {
        const reqBody = req.body;
    
        // Assuming you have a function to generate a unique clientresponse ID
        const newClientResponseId = await idGenerator('clientresponse', 'clientresponse_table');
    
        // Ensure that the provided questionID is a valid foreign key
        db.query('SELECT * FROM question_table WHERE questionID = ?', [reqBody.questionID], (err, questionResponse) => {
          if (err) {
            throw new Error(err.message);
          } else if (questionResponse.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid questionID. Question not found.' });
          } else {
            // Ensure that the provided userID is a valid foreign key
            db.query('SELECT * FROM user_table WHERE userID = ?', [reqBody.userID], (err, userResponse) => {
              if (err) {
                throw new Error(err.message);
              } else if (userResponse.length === 0) {
                return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid userID. User not found.' });
              } else {
                // Construct the client response data
                const clientResponseData = {
                  clientresponseID: newClientResponseId,
                  questionID: reqBody.questionID,
                  userID: reqBody.userID,
                  clientInput: reqBody.clientInput,
                  comments: reqBody.comments,
                  klocinput: reqBody.klocinput,
                };
    
                // Insert the new client response into the 'clientresponse_table' using parameterized query
                const query = 'INSERT INTO clientresponse_table SET ?';
                db.query(query, [clientResponseData], (err, response) => {
                  if (err) {
                    throw new Error(err.message);
                  }
                  return res.status(StatusCodes.OK).json({
                    msg: 'Client response created successfully',
                    data: clientResponseData,
                  });
                });
              }
            });
          }
        });
      } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
      }
    
    },
    // Use the createClientResponse function in your routes
    

    updateClientResponse :async (req, res) => {
      try {
        const reqBody = req.body;
        const clientresponseID = req.params.clientresponseID; // Assuming the clientresponseID is in the route params
    
        // Check if the client response with the provided ID exists
        db.query('SELECT * FROM clientresponse_table WHERE clientresponseID = ?', clientresponseID, (err, clientResponse) => {
          if (err) {
            throw new Error(err.message);
          } else if (clientResponse.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: 'No client response found with provided clientresponseID!' });
          } else {
            // Ensure that the provided questionID is a valid foreign key
            db.query('SELECT * FROM question_table WHERE questionID = ?', [reqBody.questionID], (err, questionResponse) => {
              if (err) {
                throw new Error(err.message);
              } else if (questionResponse.length === 0) {
                return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid questionID. Question not found.' });
              } else {
                // Ensure that the provided userID is a valid foreign key
                db.query('SELECT * FROM user_table WHERE userID = ?', [reqBody.userID], (err, userResponse) => {
                  if (err) {
                    throw new Error(err.message);
                  } else if (userResponse.length === 0) {
                    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid userID. User not found.' });
                  } else {
                    // Update the client response in the clientresponse_table
                    const updateQuery = 'UPDATE clientresponse_table SET ? WHERE clientresponseID = ?';
                    db.query(updateQuery, [reqBody, clientresponseID], (err, updateResponse) => {
                      if (err) {
                        throw new Error(err.message);
                      } else {
                        // Retrieve the updated client response data
                        db.query('SELECT * FROM clientresponse_table WHERE clientresponseID = ?', clientresponseID, (err, updatedClientResponse) => {
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
    
        // Check if the client response with the provided ID exists
        db.query('SELECT * FROM clientresponse_table WHERE clientresponseID = ?', clientresponseID, (err, clientResponse) => {
          if (err) {
            throw new Error(err.message);
          } else if (clientResponse.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: 'No client response found with provided clientresponseID!' });
          } else {
            // Delete the client response from the clientresponse_table
            const deleteQuery = 'DELETE FROM clientresponse_table WHERE clientresponseID = ?';
            db.query(deleteQuery, clientresponseID, (err, deleteResponse) => {
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
module.exports  = clientResponseController