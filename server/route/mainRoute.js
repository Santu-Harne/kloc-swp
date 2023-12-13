const userRoute = require('./userRoutes')
const authRoute = require('./authRoute')
const sectionRoute=require('./sectionRoute')


module.exports = mainRoute
const questionRoute = require('./questionRoutes')
const clientresposeRoute =  require('./clientResponseRoutes')
const competencyAnalysisRoute=require('./competencyAnalysisRoute')
const coreCompetencyController=require('./coreCompetencyRoute')

const mainRoute = {
  userRoute,
  authRoute,
  questionRoute,
  clientresposeRoute,
  competencyAnalysisRoute,
  coreCompetencyController,
  sectionRoute
}

module.exports = mainRoute 
