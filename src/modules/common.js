'use strict'

const Boom = require('boom')

/**
 * Building Boom errors
 *
 * @param  {Int} statusCode http status code of the error
 * @param  {String} message public message of the error
 * @return {Object} error response
 */
function buildError (statusCode = 500, message = 'Internal server error') {
  let builtError

  switch (statusCode) {
    case 404:
      builtError = Boom.notFound([message])
      break

    case 409:
      builtError = Boom.conflict([message])
      break

    default:
      builtError = Boom.badImplementation([message])
      break
  }

  return {
    statusCode: builtError.output.statusCode,
    output: builtError.output
  }
}

module.exports = {
  buildError
}
