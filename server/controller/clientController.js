const assert = require('assert')
const bcrypt = require("bcryptjs")
const { StatusCodes } = require('http-status-codes')
const db = require('../db/database')
const idGenerator = require('./../utils/idGenerator')


const clientController = {
  getAll: async (req, res) => {
    const query = 'SELECT * FROM client_table'
    db.query(query, (err, response) => {
      if (err) assert.deepStrictEqual(err, null);
      res.status(StatusCodes.OK).json({ msg: 'All clients data', data: response })
    })
  },

  createClient: async (req, res) => {
    const reqBody = req.body
    const newId = await idGenerator('client', 'client_table')
    const encPass = await bcrypt.hash(reqBody.password, 10)
    const clientData = { ...reqBody, clientId: newId, password: encPass, }
    const query = 'INSERT INTO client_table SET ?';

    db.query(query, clientData, (err, response) => {
      if (err) assert.deepStrictEqual(err, null);
      res.status(StatusCodes.OK).json({ msg: 'Client data created successfully', data: clientData })
    })
  }

}
module.exports = clientController