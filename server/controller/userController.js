const assert = require('assert')
const jwt = require("jsonwebtoken")
const sendMail = require('./../middleware/mail')
const registerTemplate = require('./../templates/registerTemplate')
const resetPasswordTemplate = require('./../templates/resetPasswordTemplate')
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

  getSingle: async (req, res) => {
    try {
      const userId = req.params.userId
      const query = 'SELECT * FROM user_table WHERE userId = ?'

      db.query(query, userId, (err, response) => {
        if (err) assert.deepStrictEqual(err, null);
        else if (response.length === 0) {
          res.status(StatusCodes.BAD_REQUEST).json({ msg: 'No user present with provided userId!' })
        }
        else res.status(StatusCodes.OK).json({ msg: 'User data', data: response[0] })
      })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message })
    }
  },

  createUser: async (req, res) => {
    try {
      const reqBody = req.body
      db.query('SELECT * FROM user_table WHERE userEmail = ?', reqBody.userEmail, async (err, resData) => {
        if (err) assert.deepStrictEqual(err, null);
        else if (resData.length > 0) {
          return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'User already exists with this email!' })
        }
        else {
          const newId = await idGenerator('user', 'user_table')
          const encPass = await bcrypt.hash(reqBody.userPassword, 10)
          const userData = { ...reqBody, userId: newId, userPassword: encPass, userRole: 'client', userFinalCommit: false }

          const query = 'INSERT INTO user_table SET ?';

          db.query(query, userData, (err, data) => {
            if (err) assert.deepStrictEqual(err, null);
            else {
              const subject = 'Confirmation of registration with KLOC-SWP'
              const template = registerTemplate(reqBody.userName, reqBody.userEmail, reqBody.userPassword)
              // sendMail(userData.userEmail, subject, template)
              return res.status(StatusCodes.OK).json({ msg: 'User data created successfully', data: userData })
            }
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
  },

  resetPassword: async (req, res) => {
    try {
      const reqBody = req.body;
      const userId = req.params.userId;
      db.query('SELECT * FROM user_table WHERE userId=?', userId, async (err, response) => {
        if (err) assert.deepStrictEqual(err, null);

        // user email exists or not
        const extUser = response[0]
        if (!extUser)
          return res.status(StatusCodes.BAD_REQUEST).json({ msg: "No user present with provided userId!" })

        // compare password
        // const isMatch = await bcrypt.compare(reqBody.oldPassword, extUser.userPassword)
        const isMatch = await bcrypt.compare(reqBody.oldPassword, extUser.userPassword)
        if (!isMatch)
          return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Old password doesn't match!" })

        const encPass = await bcrypt.hash(reqBody.newPassword, 10)

        const query = `UPDATE user_table SET userPassword = ? WHERE userId = ?`;

        db.query(query, [encPass, userId], (err, result) => {
          if (err) assert.deepStrictEqual(err, null);

          res.status(StatusCodes.OK).json({ msg: "Password changed successfully!" })
        })
      })

    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message })
    }
  },

  forgotPasswordMail: async (req, res) => {
    try {
      const { userEmail } = req.body
      db.query('SELECT * FROM user_table WHERE userEmail = ?', userEmail, (err, result) => {
        if (err) assert.deepStrictEqual(err, null);
        else if (result.length === 0)
          return res.status(StatusCodes.BAD_REQUEST).json({
            msg: `User doesn't exists with this email!`
          })
        else {
          const token = jwt.sign({ userEmail }, process.env.TOKEN_SECRET, { expiresIn: '5h' })
          const template = resetPasswordTemplate(token)
          const subject = 'Reset Password'
          sendMail(userEmail, subject, template)
          res.status(StatusCodes.OK).json({ msg: "Password reset link sent successfully, please check your email!" })
        }
      })

    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message })
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body
      jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
        if (err) {
          if (err.name === 'TokenExpiredError')
            return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Token expired, Please login again!" })
        }

        else {
          // res.json(user.userEmail)
          const encPass = await bcrypt.hash(newPassword, 10)

          const query = `UPDATE user_table SET userPassword = ? WHERE userEmail = ?`;

          db.query(query, [encPass, user.userEmail], (err, result) => {
            if (err) assert.deepStrictEqual(err, null);

            res.status(StatusCodes.OK).json({ msg: "Password changed successfully!" })
          })
        }
      })

    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message })
    }
  }

}
module.exports = userController