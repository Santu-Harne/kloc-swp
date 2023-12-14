const express = require('express');
const authRoute = require('./authRoute')
const userRoute = require('./userRoutes')
const questionRoute = require('./questionRoutes')
const clientResponseRoute = require('./clientResponseRoutes')
const competencyAnalysisRoute = require('./competencyAnalysisRoute')
const coreCompetencyRoute = require('./coreCompetencyRoute')
const sectionRoute = require('./sectionRoute')

const allRoutes = express.Router();

allRoutes.use('/api/', authRoute)
allRoutes.use('/api/user', userRoute)
allRoutes.use('/api/', questionRoute)
allRoutes.use('/api/', competencyAnalysisRoute)
allRoutes.use('/api/', coreCompetencyRoute)
allRoutes.use('/api', clientResponseRoute)
allRoutes.use('/api/section', sectionRoute)


// export all routes
module.exports = allRoutes

