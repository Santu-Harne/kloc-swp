const route = require('express').Router()
const clientResponseController =  require('../controller/clientResponseController')


route.get('/get_allclientreponses',clientResponseController.getAllClientResponses)
route.post('/create_clientresponse',clientResponseController.createClientResponse)
route.put('/update_clientresponse/:clientresponseID',clientResponseController.updateClientResponse)
route.delete('/delete_clientresponse/:clientresponseID',clientResponseController.deleteClientResponse)
route.get('/get_clientresponse/:clientresponseID',clientResponseController.getClientResponse)
module.exports =  route 