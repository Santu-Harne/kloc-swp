const assert = require('assert')
const bcrypt = require("bcryptjs")
const { StatusCodes } = require('http-status-codes')
const db = require('../db/database')
const idGenerator = require('../utils/idGenerator')


const userController = {
  getAll: async (req, res) => {
    try {
      const query = 'SELECT * FROM user_table'
      db.query(query, (err, response) => {
        if (err) assert.deepStrictEqual(err, null);
        res.status(StatusCodes.OK).json({ msg: 'All users data', data: response })
      })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message })
    }
  },

  createUser: async (req, res) => {
    try {
      const reqBody = req.body
      db.query('SELECT * FROM user_table WHERE userEmail = ?', reqBody.userEmail, async (err, response) => {
        if (err) assert.deepStrictEqual(err, null);
        else if (response.length > 0) {
          return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'User already exists with this email!' })
        }
        else {
          const newId = await idGenerator('user', 'user_table')
          const encPass = await bcrypt.hash(reqBody.userPassword, 10)
          const role = `${req.body.userEmail.endsWith('kloctechnologies.com') ? 'admin' : 'client'}`
          const userData = { ...reqBody, userId: newId, userPassword: encPass, userRole: role, userFinalCommit: false }
          const query = 'INSERT INTO user_table SET ?';

          db.query(query, userData, (err, response) => {
            if (err) assert.deepStrictEqual(err, null);
            return res.status(StatusCodes.OK).json({ msg: 'User data created successfully', data: userData })
          })
        }
      })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message })
    }
  },

  updateUser: async (req, res) => {
    try {
      const reqBody = req.body
      const userId = req.params.userId
      db.query('SELECT * FROM user_table WHERE userId = ?', userId, (err, user) => {
        if (err) throw err;
        else if (!user.length)
          return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'No user present with provided userId!' })
        else {
          db.query('SELECT * FROM user_table WHERE userEmail = ?', reqBody.userEmail, async (err, response) => {
            if (err) assert.deepStrictEqual(err, null);
            else if (response.length > 0 && userId !== response[0].userId) {
              return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'User already exists with this email!' })
            }
            else {
              const query = 'UPDATE user_table  SET ? WHERE userId = ?';
              db.query(query, [reqBody, userId], (err, response) => {
                if (err) assert.deepStrictEqual(err, null);
                else (db.query('SELECT * FROM user_table WHERE userId = ?', userId, (err, data) => {
                  return res.status(StatusCodes.OK).json({ msg: 'User data updated successfully', data: data[0] })
                }))
              })
            }
          })
        }
      })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message })
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.params.userId
      db.query('SELECT * FROM user_table WHERE userId = ?', userId, (err, user) => {
        if (err) throw err;
        else if (!user.length)
          return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'No user present with provided userId!' })
        else {
          db.query('DELETE FROM user_table WHERE userId = ?', userId, (err, response) => {
            if (err) assert.deepStrictEqual(err, null);
            return res.status(StatusCodes.OK).json({ msg: 'User deleted successfully!', deletedId: userId })
          })
        }
      })

    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message })
    }
  }
}
module.exports = userController