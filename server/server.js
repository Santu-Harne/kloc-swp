require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { StatusCodes } = require('http-status-codes')
const path = require('path')

//port
const PORT = process.env.PORT

// ref
const app = express()

// body parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// middleware
app.use(cors(
  {
    credentials: true,
    origin: "*"
  }
))

// route imports
const clientRoute = require('./route/clientRoutes')

//primary routes
app.use('/api/client', clientRoute)

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