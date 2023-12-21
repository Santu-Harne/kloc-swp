const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: "KLOC-SWP API",
    description: 'Description'
  },
  host: 'localhost:7000'
};

const outputFile = './swagger-output.json'
const routes = ['./route/mainRoute.js']

swaggerAutogen(outputFile, routes, doc)

