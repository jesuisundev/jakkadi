'use strict'

const baseURL = `http://localhost:8080`

/**
 * generate options payload for request-promise
 * @param  {string} endpoint
 * @param  {string} method
 * @param  {Object} data
 * @param  {Object} headers
 * @return {Object}
 */
const generatePayload = (endpoint, method, data, headers) => {
  let options = {
    method: method,
    uri: `${baseURL}${endpoint}`,
    json: true,
    resolveWithFullResponse: true
  }

  if (data) {
    options = Object.assign({}, options, { body: data })
  }

  if (headers) {
    options = Object.assign({}, options, headers)
  }

  return options
}

module.exports = {
  generatePayload
}
