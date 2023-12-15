const userRoute = require('./userRoutes')
const authRoute = require('./authRoute')



const questionRoute = require('./questionRoutes')
const clientresposeRoute =  require('./clientResponseRoutes')
const competitiveAnalysisRoute=require('./competitiveAnalysisRoute')
const coreCompetencyController=require('./coreCompetencyRoute')
const sectionRoute=require('./sectionRoute')


const mainRoute = {
  userRoute,
  authRoute,
  questionRoute,
  clientresposeRoute,
  competitiveAnalysisRoute,
  coreCompetencyController,
  sectionRoute
}

module.exports = mainRoute 
