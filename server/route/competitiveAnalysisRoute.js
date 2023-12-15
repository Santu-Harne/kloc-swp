const route = require('express').Router()
const competitiveAnalysisController=require('../controller/competitiveAnalysisController')

route.post('/competitionAnalysis/create/:userId',competitiveAnalysisController.createCompetitiveAnalysis)
route.get('/competitionAnalysis/getAll/:userId',competitiveAnalysisController.getAllCompetitiveAnalysis)
route.get('/competitionAnalysis/get/:userId/:competitionAnalysisId',competitiveAnalysisController.getCompetitiveAnalysis)
route.put('/competitionAnalysis/update/:userId/:competitionAnalysisId',competitiveAnalysisController.updateCompetitiveAnalysis)
route.delete('/competitionAnalysis/delete/:userId/:competitionAnalysisId',competitiveAnalysisController.deleteCompetitiveAnalysis)
module.exports = route