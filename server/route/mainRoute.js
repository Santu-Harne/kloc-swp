const userRoute = require('./userRoutes')
const authRoute = require('./authRoute')
const competencyAnalysisRoute=require('./competencyAnalysisRoute')
const coreCompetencyController=require('./coreCompetencyRoute')

const mainRoute = {
  userRoute,
  authRoute,
  competencyAnalysisRoute,
  coreCompetencyController
}

module.exports = mainRoute