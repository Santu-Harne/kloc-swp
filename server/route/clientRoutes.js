const route = require('express').Router()

const clientController = require('./../controller/clientController')

route.get('/get_all', clientController.getAll)
route.post('/create_client', clientController.createClient)

module.exports = route