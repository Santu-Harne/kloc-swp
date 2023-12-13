const userRoute = require('./userRoutes')
const authRoute = require('./authRoute')
const questionRoute = require('./questionRoutes')
const clientresposeRoute =  require('./clientResponseRoutes')
const mainRoute = {
  userRoute,
  authRoute,
  questionRoute,
  clientresposeRoute
  
}

module.exports = mainRoute 