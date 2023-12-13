const assert = require('assert')
const bcrypt = require("bcryptjs")
const { StatusCodes } = require('http-status-codes')
const db = require('../db/database')
const idGenerator = require('../utils/idGenerator')


const userController = {
  getAll: async (req, res) => {
    const query = 'SELECT * FROM user_table'
    db.query(query, (err, response) => {
      if (err) assert.deepStrictEqual(err, null);
      res.status(StatusCodes.OK).json({ msg: 'All users data', data: response })
    })
  },
  createUser: async (req, res) => {
    const reqBody = req.body
    const newId = await idGenerator('user', 'user_table')
    const encPass = await bcrypt.hash(reqBody.userPassword, 10)
    const userData = { ...reqBody, userId: newId, userPassword: encPass, userRole: `${req.body.userEmail.endsWith('kloctechnologies.com') ? 'admin' : 'client'}`, finalCommit: false }
    const query = 'INSERT INTO user_table SET ?';

    db.query(query, userData, (err, response) => {
      if (err) assert.deepStrictEqual(err, null);
      res.status(StatusCodes.OK).json({ msg: 'User data created successfully', data: userData })
    })
    // res.json(userData)
  }

}
module.exports = userController