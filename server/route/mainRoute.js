// const express = require('express');
const authRoute = require('./authRoute')
const userRoute = require('./userRoutes')
const questionRoute = require('./questionRoutes')
const competencyAnalysisRoute = require('./competencyAnalysisRoute')
const clientResponseRoute = require('./clientResponseRoutes')
const coreCompetencyRoute = require('./coreCompetencyRoute')

// const allRoutes = express.Router();

// allRoutes.use('/auth', authRoute)
// allRoutes.use('/user', userRoute)
// allRoutes.use('/question', questionRoute)
// allRoutes.use('/competencyAnalysis', competencyAnalysisRoute)
// allRoutes.use('/coreCompetency', coreCompetencyRoute)
// allRoutes.use('clientResponse', clientResponseRoute)

const mainRoute = {
  userRoute,
  authRoute,
  questionRoute,
  clientResponseRoute,
  competencyAnalysisRoute,
  coreCompetencyRoute
}

module.exports = mainRoute
// module.exports = allRoutes 