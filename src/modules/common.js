'use strict'

const path = require('path')
const Boom = require('boom')

const config = require(path.resolve('config/config.json'))
const logger = require(path.resolve('src/modules/logger')).generate(config, module.filename)
const cache = require(path.resolve('src/modules/cacheManager')).cacheSingleton

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

/**
 * TODO - Make node-cache-async library
 */
async function getAsyncCache (key) {
  return cache.getInstance().getAsync(key)

    .then(data => Promise.resolve(data))

    .catch(error => {
      logger.error(JSON.stringify(error))
      return false
    })
}

/**
 * TODO - Make node-cache-async library
 */
async function setAsyncCache (key, data) {
  return cache.getInstance().setAsync(key, data)

    .then(() => Promise.resolve())

    .catch(error => {
      logger.error(JSON.stringify(error))
      return Promise.resolve()
    })
}

/**
 * TODO - Make node-cache-async library
 */
async function delAsyncCache (key, data) {
  cache.getInstance().delAsync(key, data)
}

module.exports = {
  buildError,
  getAsyncCache,
  setAsyncCache,
  delAsyncCache
}
