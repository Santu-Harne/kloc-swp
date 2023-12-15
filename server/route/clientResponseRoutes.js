const route = require('express').Router()
const clientResponseController =  require('../controller/clientResponseController')


route.get('/clientreponse/getAll/:userId/:questionId',clientResponseController.getAllClientResponses)
route.post('/clientresponse/create/:userId/:questionId',clientResponseController.createClientResponse)
route.put('/clientresponse/update:userId/:questionId/:clientresponseId',clientResponseController.updateClientResponse)
route.delete('/clientresponse/delete/:userId/:questionId/:clientresponseId',clientResponseController.deleteClientResponse)
route.get('/clientresponse/get/:userId/:questionId/:clientresponseId',clientResponseController.getClientResponse)
module.exports =  route 