const route = require('express').Router()
const authController = require('./../controller/authController')

route.post('/login', authController.login)

module.exports = route