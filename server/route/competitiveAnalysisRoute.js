const route = require('express').Router()
const competitiveAnalysisController=require('../controller/competitiveAnalysisController')

route.post('/competitiveAnalysis/create/:userId',competitiveAnalysisController.createCompetitiveAnalysis)
route.get('/competitiveAnalysis/getAll/:userId',competitiveAnalysisController.getAllCompetitiveAnalysis)
route.get('/competitiveAnalysis/get/:userId/:competitiveAnalysisId',competitiveAnalysisController.getCompetitiveAnalysis)
route.put('/competitiveAnalysis/update/:userId/:competitiveAnalysisId',competitiveAnalysisController.updateCompetitiveAnalysis)
route.delete('/competitiveAnalysis/delete/:userId/:competitiveAnalysisId',competitiveAnalysisController.deleteCompetitiveAnalysis)
module.exports = route