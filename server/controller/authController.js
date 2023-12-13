const assert = require('assert')
const bcrypt = require("bcryptjs")
const { StatusCodes } = require('http-status-codes')
const db = require('../db/database')
const { tokenGenerator } = require('./../utils/tokenGenerator')

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body

      db.query('SELECT * FROM user_table WHERE userEmail=?', email, async (err, response) => {
        if (err) assert.deepStrictEqual(err, null);

        // user email exists or not
        const extUser = response[0]
        if (!extUser)
          return res.status(StatusCodes.BAD_REQUEST).json({ msg: "User doesn't exists with this email!" })
        // compare password
        const isMatch = await bcrypt.compare(password, extUser.userPassword)
        if (!isMatch)
          return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid password!" })

        // generate token
        const authToken = tokenGenerator({ extUser })

        res.status(StatusCodes.OK).json({ msg: "Login Successful!", authToken, user: extUser })
      })

    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message })
    }

  }
}
module.exports = authController