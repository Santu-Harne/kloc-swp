const route = require('express').Router()
const coreCompetencyController=require('../controller/coreCompetencyController')

route.post('/coreCompetencyName/create',coreCompetencyController.createCoreCompentencyName)
route.get('/coreCompetencyName/getAll',coreCompetencyController.getCoreCompetencyNames)
route.get('/coreCompetencyName/get/:coreCompetencyNameId',coreCompetencyController.getCoreCompetencyName)
route.put('/coreCompetencyName/update/:coreCompetencyNameId',coreCompetencyController.updateCoreCompetencyName)
route.delete('/coreCompetencyName/delete/:coreCompetencyNameId',coreCompetencyController.deleteCoreCompetencyName)


route.post('/coreCompetencies/create/:userId/',coreCompetencyController.createCoreCompetencies)
route.get('/coreCompetencies/getAll/:userId/',coreCompetencyController.getAllCoreCompetencies)
route.get('/coreCompetencies/get/:userId/:coreCompetencyNameId/',coreCompetencyController.getCoreCompetencies)
route.put('/coreCompetencies/update/:userId/:coreCompetencyNameId',coreCompetencyController.updateCoreCompetencies)
route.delete('/coreCompetencies/delete/:userId/:coreCompetencyNameId',coreCompetencyController.deleteCoreCompetencies)



module.exports=route