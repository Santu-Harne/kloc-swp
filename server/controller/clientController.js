const assert = require('assert')
const bcrypt = require("bcryptjs")
const { StatusCodes } = require('http-status-codes')
const db = require('../db/database')


// Function to generate a new client ID
function generateClientId() {
  const query = 'SELECT clientId AS maxClientId FROM client_table';

  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        let maxClientId = results[0].maxClientId || 'client_0000';
        const currentNumber = parseInt(maxClientId.split('_')[1]);
        const nextNumber = currentNumber + 1;
        const nextClientId = `client_${nextNumber.toString().padStart(4, '0')}`;
        resolve(nextClientId);
      }
    });
  });
}


const clientController = {
  getAll: async (req, res) => {
    // const query = 'SELECT * FROM client_table'
    // db.query(query, (err, response) => {
    //   if (err) assert.deepStrictEqual(err, null);
    //   res.status(StatusCodes.OK).json({ msg: 'All clients data', data: response })
    // })
    const query = 'SELECT MAX(userId) AS maxUserId FROM user';

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching max userId:', err);
        callback(err, null);
        return;
      }
      let maxUserId = results[0].maxUserId || 'user_0000';
      const currentNumber = parseInt(maxUserId.split('_')[1]);
      const nextNumber = currentNumber + 1;
      const nextClientId = `user_${nextNumber.toString().padStart(4, '0')}`;
      res.json(nextClientId)
    })
  },


  createClient: async (req, res) => {
    const client = req.body
    const encPass = await bcrypt.hash(client.password, 10)
    const clientData = { ...client, password: encPass }
    const query = 'INSERT INTO client_table SET ?';

    db.query(query, clientData, (err, response) => {
      if (err) assert.deepStrictEqual(err, null);
      res.status(StatusCodes.OK).json({ msg: 'Client data created successfully', data: clientData })
    })
  }

}
module.exports = clientController