const route = require('express').Router()
const clientResponseController =  require('../controller/clientResponseController')


route.get('/get_all',clientResponseController.getAllClientResponses)
route.post('/create/:userId',clientResponseController.createClientResponse)
route.put('/update/:clientresponseID',clientResponseController.updateClientResponse)
route.delete('/delete/:userId/:clientresponseID',clientResponseController.deleteClientResponse)
route.get('/get/:clientresponseID',clientResponseController.getClientResponse)
route.get('/get_all/:userId',clientResponseController.getAllClientResponsesByUserId)
route.get('/get_all/:userId/:questionId',clientResponseController.getClientResponsesByUserIdAndQuestionId)
module.exports =  route  