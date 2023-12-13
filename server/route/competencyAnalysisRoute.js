const route = require('express').Router()
const competitionAnalysisController=require('../controller/competitionAnalysisController')

route.post('/create_competition_analysis/:userId',competitionAnalysisController.createCompetitionAnalysis)
route.get('/get_all_competition_analysis/:userId',competitionAnalysisController.getAllCompetitionAnalysis)
route.get('/get_competition_analysis/:userId/:competitionAnalysisId',competitionAnalysisController.getCompetitionAnalysis)
route.put('/update_competition_analysis/:userId/:competitionAnalysisId',competitionAnalysisController.updateCompetitionAnalysis)
route.delete('/delete_competition_analysis/:userId/:competitionAnalysisId',competitionAnalysisController.deleteCompetitionAnalysis)
module.exports = route