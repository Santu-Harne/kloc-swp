require('dotenv').config()
const express = require('express')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const cors = require('cors')
const { StatusCodes } = require('http-status-codes')
const path = require('path')
const bodyParser = require('body-parser');


//port
const PORT = process.env.PORT || 7000

// ref
const app = express()

// all api route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
const allRoutes = require('./route/mainRoute')

//primary routes
app.use('/', allRoutes)

// default route
app.all('*', (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ msg: "The request route path not found" })
})

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