const userRoute = require('./userRoutes')
const authRoute = require('./authRoute')



const questionRoute = require('./questionRoutes')
const clientresposeRoute =  require('./clientResponseRoutes')
const competencyAnalysisRoute=require('./competencyAnalysisRoute')
const coreCompetencyController=require('./coreCompetencyRoute')
const sectionRoute=require('./sectionRoute')


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
