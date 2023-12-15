const assert = require('assert')
const bcrypt = require("bcryptjs")
const { StatusCodes } = require('http-status-codes')
const db = require('../db/database')
const idGenerator = require('../utils/idGenerator')
const clientResponseController = {
    getAllClientResponses: async (req, res) => {
      try {
        const userId=req.params.userId
        const questionId=req.params.questionId
        db.query(`SELECT userId FROM user_table WHERE userId=?`,userId,async(userErr,userRes)=>{
          if (userErr){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
            return;
          }
          if (userRes.length===0){
            res.status(StatusCodes.BAD_REQUEST).json({ msg: 'User Not Found' });
            return;
          }
          db.query(`SELECT questionId FROM question_table WHERE questionId=?`,questionId,async(quesErr,quesRes)=>{
            if (quesErr){
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
              return;
            }
            if (quesRes.length===0){
              res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Question Not Found' });
              return;
            }
            const query = 'SELECT * FROM clientresponse_table'
            db.query(query, (err, response) => {
              if (err) assert.deepStrictEqual(err, null);
              res.status(StatusCodes.OK).json({ msg: 'All clientResponse data', data: response })
            })
          })
        })
      } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message })
      }
    },
    createClientResponse :async (req, res) => {  
      try {
        const reqBody = req.body;
        const userId=req.params.userId
        const questionId=req.params.questionId
    
        // Assuming you have a function to generate a unique clientresponse ID
        const newClientResponseId = await idGenerator('clientResponse', 'clientResponse_table');

        db.query(`SELECT userId FROM user_table WHERE userId=?`,userId,async(userErr,userRes)=>{
          if (userErr){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
            return;
          }
          if (userRes.length===0){
            res.status(StatusCodes.BAD_REQUEST).json({ msg: 'User Not Found' });
            return;
          }
          db.query(`SELECT questionId FROM question_table WHERE questionId=?`,questionId,async(quesErr,quesRes)=>{
            if (quesErr){
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
              return;
            }
            if (quesRes.length===0){
              res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Question Not Found' });
              return;
            }
            const clientResponseData={...reqBody,userId:userId,questionId:questionId,clientResponseId:newClientResponseId}
            const query = 'INSERT INTO clientresponse_table SET ?';
            db.query(query, clientResponseData, (finalErr, finalRes) => {
              console.log(finalErr)
              if (finalErr) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                return;
              }
              return res.status(StatusCodes.OK).json({ msg: 'ClientResponse Data Created Successfully', data: clientResponseData });
            });
          })
        })
      } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
      }
    
    },
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
module.exports = clientResponseController