'use strict'

// Modules.
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = 3000

const { people } = require('./routes')
const { logger: { loggerMiddleware, requestLogger }, errorHandler } = require('./modules')

// Middlewares.
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(loggerMiddleware)
// Request logger => ./log/request.log
app.use(requestLogger)

// API's.
app.use('/people', people)

// Error handler.
app.use(errorHandler)

app.listen(port, () => console.log(`Listening on port ${port}...`))
