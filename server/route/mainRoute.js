const userRoute = require('./userRoutes')
const authRoute = require('./authRoute')
const sectionRoute=require('./sectionRoute')


module.exports = mainRoute
const questionRoute = require('./questionRoutes')
const clientresposeRoute =  require('./clientResponseRoutes')
const mainRoute = {
  userRoute,
  authRoute,
  questionRoute,
  clientresposeRoute,
  sectionRoute
  
}

module.exports = mainRoute 
