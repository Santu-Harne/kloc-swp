require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { StatusCodes } = require('http-status-codes')
const path = require('path')
const bodyParser = require('body-parser');



//port
const PORT = process.env.PORT

// ref
const app = express()

// body parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(bodyParser.json());


// middleware
app.use(cors(
  {
    credentials: true,
    origin: "*"
  }
))

// route imports
const mainRoute = require('./route/mainRoute')

//primary routes
app.use('/api/user', mainRoute.userRoute)
app.use('/api/section', mainRoute.sectionRoute)
app.use('/api', mainRoute.authRoute)

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`server is listening @ http://localhost:${PORT}`);
    })
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message })
  }
}

start()