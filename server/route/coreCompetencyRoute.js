const route = require('express').Router()
const coreCompetencyController=require('../controller/coreCompetencyController')

route.post('/corecompentencyname/create',coreCompetencyController.createCoreCompentencyName)
route.get('/corecompetencyname/getAll',coreCompetencyController.getCoreCompetencyNames)
route.get('/corecompetencyname/get/:corecompetencyId',coreCompetencyController.getCoreCompetencyName)
route.put('/corecompetencyname/update/:corecompetencyId',coreCompetencyController.updateCoreCompetency)
route.delete('/corecompetencyname/delete/:corecompetencyId',coreCompetencyController.deleteCoreCompetencyName)


route.post('/corecompetencies/create/:userId/',coreCompetencyController.createCoreCompetencies)
route.get('/corecompetencies/getAll/:userId/',coreCompetencyController.getAllCoreCompetencies)
route.get('/corecompetencies/get/:userId/:corecompetencyId/',coreCompetencyController.getCoreCompetencies)
route.put('/corecompetencies/update/:userId/:corecompetencyId/:competencyId',coreCompetencyController.updateCoreCompetencies)
route.delete('/corecompetencies/delete/:userId/:corecompetencyId/:competencyId',coreCompetencyController.deleteCoreCompetencies)



module.exports=route