const route = require('express').Router()
const coreCompetencyController=require('../controller/coreCompetencyController')

route.post('/create_core_compentency_name',coreCompetencyController.createCoreCompentencyName)
route.get('/get_all_core_competency_names',coreCompetencyController.getCoreCompetencyNames)
route.get('/get_core_competency_name/:corecompetencyId',coreCompetencyController.getCoreCompetencyName)
route.put('/update_core_competency_name/:corecompetencyId',coreCompetencyController.updateCoreCompetency)
route.delete('/delete_core_competency_name/:corecompetencyId',coreCompetencyController.deleteCoreCompetencyName)


route.post('/create_core_competencies/:userId/:corecompetencyId',coreCompetencyController.createCoreCompetencies)
route.get('/get_all_core_competencies/:userId/:corecompetencyId',coreCompetencyController.getAllCoreCompetencies)
route.get('/get_core_competencies/:userId/:corecompetencyId/:competencyId',coreCompetencyController.getCoreCompetencies)
route.put('/update_core_competencies/:userId/:corecompetencyId/:competencyId',coreCompetencyController.updateCoreCompetencies)
route.delete('/delete_core_competencies/:userId/:corecompetencyId/:competencyId',coreCompetencyController.deleteCoreCompetencies)



module.exports=route