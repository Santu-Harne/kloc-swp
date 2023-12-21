const route = require('express').Router()
const competitionAnalysisController=require('../controller/competitionAnalysisController')

route.post('/competitionAnalysis/create/:userId',competitionAnalysisController.createCompetitionAnalysis)
route.get('/competitionAnalysis/getAll/:userId',competitionAnalysisController.getAllCompetitionAnalysis)
route.get('/competitionAnalysis/get/:userId/:competitionAnalysisId',competitionAnalysisController.getCompetitionAnalysis)
route.put('/competitionAnalysis/update/:userId/:competitionAnalysisId',competitionAnalysisController.updateCompetitionAnalysis)
route.delete('/competitionAnalysis/delete/:userId/:competitionAnalysisId',competitionAnalysisController.deleteCompetitionAnalysis)
module.exports = route