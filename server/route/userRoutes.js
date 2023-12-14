const route = require('express').Router()
const auth = require('../middleware/auth')

const userController = require('../controller/userController')

route.get('/get_all', userController.getAll)
route.get('/get_single/:userId', userController.getSingle)
route.post('/create_user', userController.createUser)
route.put('/update_user/:userId', userController.updateUser)
route.delete('/delete_user/:userId', userController.deleteUser)

route.put('/reset_password/:userId', userController.resetPassword)
route.post('/forgot_password_mail', userController.forgotPasswordMail)
route.put('/forgot_password', userController.forgotPassword)

module.exports = route