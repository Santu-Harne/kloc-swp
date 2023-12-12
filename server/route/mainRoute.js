const userRoute = require('./userRoutes')
const authRoute = require('./authRoute')
const sectionRoute=require('./sectionRoute')
const mainRoute = {
  userRoute,
  authRoute,
  sectionRoute

}

module.exports = mainRoute
