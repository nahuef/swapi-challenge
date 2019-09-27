'use strict'

const winston = require('winston')

const logPath = './log'

const reqLogger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ level: 'warn' }),
    new winston.transports.File({ filename: `${logPath}/requests.log`, level: 'info' })]
})

const errors = winston.createLogger({
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: `${logPath}/error.log`, level: 'error' })]
})

const debug = winston.createLogger({
  format: winston.format.simple(),
  transports: [new winston.transports.Console({ level: 'debug' })]
})

/**
 * @description Augment express req object with loggers.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {void}
 */
function loggerMiddleware (req, res, next) {
  req.debug = debug
  req.errors = errors
  next()
}

/**
 * @description Log to file certain request data from received calls.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {void}
 */
function requestLogger (req, res, next) {
  reqLogger.info({ method: req.method, path: req.url, headers: req.headers })
  next()
}

module.exports = { loggerMiddleware, requestLogger }
