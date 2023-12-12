const route = require('express').Router()
const auth = require('../middleware/auth')

const userController = require('../controller/userController')

route.get('/get_all', userController.getAll)
route.post('/create_user', userController.createUser)
route.put('/update_user/:userId', userController.updateUser)
route.delete('/delete_user/:userId', userController.deleteUser)

module.exports = route