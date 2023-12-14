// const express = require('express');
const authRoute = require('./authRoute')
const userRoute = require('./userRoutes')
const authRoute = require('./authRoute')
const questionRoute = require('./questionRoutes')
const clientResponseRoute = require('./clientResponseRoutes')
const competencyAnalysisRoute = require('./competencyAnalysisRoute')
const coreCompetencyRoute = require('./coreCompetencyRoute')
const sectionRoute = require('./sectionRoute')


const mainRoute = {
  userRoute,
  authRoute,
  questionRoute,
  clientResponseRoute,
  competencyAnalysisRoute,
  coreCompetencyRoute,
  sectionRoute
}

module.exports = mainRoute 
