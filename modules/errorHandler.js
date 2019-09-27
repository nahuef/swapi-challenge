'use strict'

/**
 * @description Error handler.
 * Will return received status code for 4xx or default to 500.
 * Same with error message.
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {Object}
 */
module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  // statsd.increment('error', { code: statusCode })

  // Logs to console for debugging.
  req.debug.log('debug', err)
  // Error logger => ./log/error.log
  req.errors.log('error', err)

  return res.status(statusCode)
    .send({ message: err.message || 'Something unexpected happened.' })
}
