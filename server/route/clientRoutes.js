const route = require('express').Router()
const auth = require('./../middleware/auth')

const clientController = require('./../controller/clientController')

route.get('/get_all', auth, clientController.getAll)
route.post('/create_client', auth, clientController.createClient)

module.exports = route