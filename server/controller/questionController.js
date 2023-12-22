const assert = require('assert')
const bcrypt = require("bcryptjs")
const { StatusCodes } = require('http-status-codes')
const db = require('../db/database')
const questionQueries = require('../utils/QuestionQuaries')
const idGenerator = require('../utils/idGenerator')
const questionController = {
  // getAllQuestions: async (req, res) => {
  //   try {
  //     const sectionId = req.params.sectionId
  //     db.query(`SELECT sectionId FROM section_table WHERE sectionId=?`, sectionId, async (sectionErr, sectionResp) => {
  //       if (sectionErr) {
  //         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
  //         return;
  //       }
  //       if (sectionResp.length === 0) {
  //         res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Section Not Found' });
  //         return;
  //       }
  //       const query = `SELECT * FROM question_table
  //       JOIN section_table ON section_table.sectionId=question_table.sectionId
  //       WHERE question_table.sectionId=?
  //       ORDER BY question_table.questionId`
  //       db.query(query, sectionId, (getErr, getRes) => {
  //         if (getErr) {
  //           res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
  //           return;
  //         }
  //         const arr = []
  //         for (let i = 0; i < getRes.length; i++) {
  //           const data = {
  //             questionId: getRes[i].questionId,
  //             questionText: getRes[i].questionText,
  //             questionInputType: getRes[i].questionInputType,
  //             exampleInput: getRes[i].exampleInput,
  //             section: {
  //               sectionId: getRes[i].sectionId,
  //               sectionName: getRes[i].sectionName
  //             }
  //           }
  //           arr.push(data)
  //         }
  //         res.status(StatusCodes.OK).json({ msg: 'All Questions Data Retrieved Successfully', data: arr })
  //         return
  //       })
  //     })
  //   } catch (error) {
  //     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message })
  //   }
  // },
  
 
  getAllQuestions: async (req, res) => {
    try {
      const sectionId = req.params.sectionId;
      db.query(questionQueries.getSectionById, sectionId, async (sectionErr, sectionResp) => {
        if (sectionErr) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
          return;
        }
        if (sectionResp.length === 0) {
          res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Section Not Found' });
          return;
        }
        db.query(questionQueries.getAllQuestions, sectionId, (getErr, getRes) => {
          if (getErr) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
            return;
          }
          const arr = [];
          for (let i = 0; i < getRes.length; i++) {
            const data = {
              questionId: getRes[i].questionId,
              questionText: getRes[i].questionText,
              questionInputType: getRes[i].questionInputType,
              exampleInput: getRes[i].exampleInput,
              section: {
                sectionId: getRes[i].sectionId,
                sectionName: getRes[i].sectionName
              }
            };
            arr.push(data);
          }
          res.status(StatusCodes.OK).json({ msg: 'All Questions Data Retrieved Successfully', data: arr });
        });
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  },
  // createQuestions: async (req, res) => {
  //   try {
  //     const sectionId = req.params.sectionId
  //     const reqBody = req.body;
  //     const newQuestionId = await idGenerator('question', 'question_table');
  //     db.query(`SELECT sectionId FROM section_table WHERE sectionId=?`, sectionId, async (sectionErr, sectionResp) => {
  //       if (sectionErr) {
  //         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
  //         return;
  //       }
  //       if (sectionResp.length === 0) {
  //         res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Section Not Found' });
  //         return;
  //       }
  //       // Check if the question with the given text already exists
  //       db.query('SELECT questionText FROM question_table WHERE questionText = ?', reqBody?.questionText, async (quesErr, quesRes) => {
  //         if (quesErr) {
  //           res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
  //           return;
  //         }
  //         if (quesRes.length > 0) {
  //           return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Question already exists with this text!' });
  //         }
  //         // Construct the question data
  //         const questionData = { ...req.body, sectionId: sectionId, questionId: newQuestionId };
  //         // Insert the new question into the 'question_table' using parameterized query
  //         const query = 'INSERT INTO question_table SET ?';
  //         db.query(query, questionData, (finalErr, finalRes) => {
  //           if (finalErr) {
  //             res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
  //             return;
  //           }
  //           return res.status(StatusCodes.OK).json({ msg: 'Question Created Successfully', data: questionData });
  //         });
  //       });
  //     })
  //   } catch (error) {
  //     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
  //   }
  // },
 
  createQuestions: async (req, res) => {
    try {
      const sectionId = req.params.sectionId;
      const reqBody = req.body;
      const newQuestionId = await idGenerator('question', 'question_table');
      db.query(questionQueries.getSectionById, sectionId, async (sectionErr, sectionResp) => {
        if (sectionErr) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
          return;
        }
        if (sectionResp.length === 0) {
          res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Section Not Found' });
          return;
        }
        db.query(questionQueries.checkQuestionText, reqBody?.questionText, async (quesErr, quesRes) => {
          if (quesErr) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
            return;
          }
          if (quesRes.length > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Question already exists with this text!' });
          }
          const questionData = { ...reqBody, sectionId: sectionId, questionId: newQuestionId };
          db.query(questionQueries.insertQuestion, questionData, (finalErr, finalRes) => {
            if (finalErr) {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
              return;
            }
            return res.status(StatusCodes.OK).json({ msg: 'Question Created Successfully', data: questionData });
          });
        });
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
    }
  },
  // updateQuestion: async (req, res) => {
  //   try {
  //     const reqBody = req.body;
  //     const questionId = req.params.questionId; // Assuming the questionID is in the route params
  //     const sectionId = req.params.sectionId
  //     isUpdatedBody = Object.keys(reqBody).length === 0;
  //     db.query(`SELECT sectionId FROM section_table WHERE sectionId=?`, sectionId, async (sectionErr, sectionResp) => {
  //       if (sectionErr) {
  //         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
  //         return;
  //       }
  //       if (sectionResp.length === 0) {
  //         res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Section Not Found' });
  //         return;
  //       }
  //       // Check if the question with the provided ID exists
  //       db.query('SELECT * FROM question_table WHERE questionID = ? AND sectionid=?', [questionId, sectionId], (quesErr, quesRes) => {
  //         if (quesErr) {
  //           res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
  //           return;
  //         }
  //         if (quesRes.length === 0) {
  //           return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Question Not Found In The Section' });
  //         }
  //         // Check if another question with the same text already exists (excluding the current question)
  //         db.query('SELECT * FROM question_table WHERE questionText = ? AND questionID != ?', [reqBody.questionText, questionId], (qtextErr, qtextRes) => {
  //           if (qtextErr) {
  //             res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
  //             return;
  //           } if (qtextRes.length > 0) {
  //             return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Another question already exists with this question text!' });
  //           }
  //           if (isUpdatedBody) {
  //             return res.status(StatusCodes.OK).json({ msg: 'Question data updated successfully', data: reqBody });
  //           } else {
  //             // Update the question in the question_table
  //             const updateQuery = 'UPDATE question_table SET ? WHERE questionId = ? AND sectionId=?';
  //             db.query(updateQuery, [reqBody, questionId, sectionId], (finalErr, finalRes) => {
  //               if (finalErr) {
  //                 res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
  //                 return;
  //               }
  //               return res.status(StatusCodes.OK).json({ msg: 'Question data updated successfully', data: reqBody });
  //             });
  //           }
  //         });
  //       });
  //     })
  //   } catch (error) {
  //     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  //   }
  // },
  
  
  updateQuestion: async (req, res) => {
    try {
      const reqBody = req.body;
      const questionId = req.params.questionId;
      const sectionId = req.params.sectionId;
      isUpdatedBody = Object.keys(reqBody).length === 0;
      db.query(questionQueries.getSectionById, sectionId, async (sectionErr, sectionResp) => {
        if (sectionErr) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
          return;
        }
        if (sectionResp.length === 0) {
          res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Section Not Found' });
          return;
        }
        db.query(questionQueries.checkExistingQuestion, [questionId, sectionId], (quesErr, quesRes) => {
          if (quesErr) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
            return;
          }
          if (quesRes.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Question Not Found In The Section' });
          }
          db.query(questionQueries.checkDuplicateQuestionText, [reqBody.questionText, questionId], (qtextErr, qtextRes) => {
            if (qtextErr) {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
              return;
            } 
            if (qtextRes.length > 0) {
              return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Another question already exists with this question text!' });
            }
            if (isUpdatedBody) {
              return res.status(StatusCodes.OK).json({ msg: 'Question data updated successfully', data: reqBody });
            } else {
              const updateQuery = questionQueries.updateQuestion;
              db.query(updateQuery, [reqBody, questionId, sectionId], (finalErr, finalRes) => {
                if (finalErr) {
                  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
                  return;
                }
                return res.status(StatusCodes.OK).json({ msg: 'Question data updated successfully', data: reqBody });
              });
            }
          });
        });
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  },
  // deleteQuestion: async (req, res) => {
  //   try {
  //     const questionId = req.params.questionId; // Assuming the questionID is in the route params
  //     const sectionId = req.params.sectionId
  //     // Check if the question with the provided ID exists
  //     db.query(`SELECT sectionId FROM section_table WHERE sectionId=?`, sectionId, async (sectionErr, sectionResp) => {
  //       if (sectionErr) {
  //         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
  //         return;
  //       }
  //       if (sectionResp.length === 0) {
  //         res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Section Not Found' });
  //         return;
  //       }
  //       // Check if the question with the provided ID exists
  //       db.query('SELECT * FROM question_table WHERE questionID = ? AND sectionid=?', [questionId, sectionId], (quesErr, quesRes) => {
  //         if (quesErr) {
  //           res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
  //           return;
  //         }
  //         if (quesRes.length === 0) {
  //           return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Question Not Found In The Section' });
  //         }
  //         // Delete the question from the question_table
  //         const deleteQuery = 'DELETE FROM question_table WHERE questionId = ? AND sectionId=?';
  //         db.query(deleteQuery, [questionId, sectionId], (deleteErr, deleteRes) => {
  //           if (deleteErr) {
  //             res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
  //             return;
  //           }
  //           return res.status(StatusCodes.OK).json({ msg: 'Question Data Deleted Successfully' });
  //         });
  //       })
  //     });
  //   } catch (error) {
  //     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  //   }


  //   // Use the deleteQuestion function in your routes

  // },
  // getQuestion: async (req, res) => {
  //   try {
  //     const questionId = req.params.questionId; // Assuming the questionID is in the route params
  //     const sectionId = req.params.sectionId
  //     db.query(`SELECT sectionId FROM section_table WHERE sectionId=?`, sectionId, async (sectionErr, sectionResp) => {
  //       if (sectionErr) {
  //         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
  //         return;
  //       }
  //       if (sectionResp.length === 0) {
  //         res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Section Not Found' });
  //         return;
  //       }
  //       db.query(`SELECT questionId FROM question_table WHERE questionId=? AND sectionId=?`, [questionId, sectionId], async (quesErr, quesRes) => {
  //         if (quesErr) {
  //           res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
  //           return;
  //         }
  //         if (quesRes.length === 0) {
  //           res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Question Not Found In The Section' });
  //           return;
  //         }
  //         // Select a question from the question_table based on questionID
  //         const query = `SELECT * FROM question_table
  //         JOIN section_table ON section_table.sectionId=question_table.sectionId
  //         WHERE question_table.questionId = ? AND question_table.sectionId=?`;
  //         db.query(query, [questionId, sectionId], (finalErr, finalRes) => {
  //           console.log(finalErr)
  //           if (finalErr) {
  //             res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
  //             return;
  //           }
  //           const data = {
  //             questionId: finalRes[0].questionId,
  //             questionText: finalRes[0].questionText,
  //             questionInputType: finalRes[0].questionInputType,
  //             exampleInput: finalRes[0].exampleInput,
  //             section: {
  //               sectionId: finalRes[0].sectionId,
  //               sectionName: finalRes[0].sectionName
  //             }
  //           }
  //           return res.status(StatusCodes.OK).json({ msg: 'Question Data Retrieved Successfully', data: data });
  //         });
  //       })
  //     })
  //   } catch (error) {
  //     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  //   }
  // }
  deleteQuestion: async (req, res) => {
    try {
      const questionId = req.params.questionId;
      const sectionId = req.params.sectionId;
      db.query(questionQueries.getSectionById, sectionId, async (sectionErr, sectionResp) => {
        if (sectionErr) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
          return;
        }
        if (sectionResp.length === 0) {
          res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Section Not Found' });
          return;
        }
        db.query(questionQueries.checkExistingQuestion, [questionId, sectionId], (quesErr, quesRes) => {
          if (quesErr) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
            return;
          }
          if (quesRes.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Question Not Found In The Section' });
          }
          const deleteQuery = questionQueries.deleteQuestion;
          db.query(deleteQuery, [questionId, sectionId], (deleteErr, deleteRes) => {
            if (deleteErr) {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
              return;
            }
            return res.status(StatusCodes.OK).json({ msg: 'Question Data Deleted Successfully' });
          });
        });
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  },
  getQuestion: async (req, res) => {
    try {
      const questionId = req.params.questionId;
      const sectionId = req.params.sectionId;
      db.query(questionQueries.getSectionById, sectionId, async (sectionErr, sectionResp) => {
        if (sectionErr) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
          return;
        }
        if (sectionResp.length === 0) {
          res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Section Not Found' });
          return;
        }
        db.query(questionQueries.getQuestionById, [questionId, sectionId], (quesErr, quesRes) => {
          if (quesErr) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
            return;
          }
          if (quesRes.length === 0) {
            res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Question Not Found In The Section' });
            return;
          }
          const data = {
            questionId: quesRes[0].questionId,
            questionText: quesRes[0].questionText,
            questionInputType: quesRes[0].questionInputType,
            exampleInput: quesRes[0].exampleInput,
            section: {
              sectionId: quesRes[0].sectionId,
              sectionName: quesRes[0].sectionName
            }
          };
          return res.status(StatusCodes.OK).json({ msg: 'Question Data Retrieved Successfully', data: data });
        });
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  }
};
module.exports = questionController 