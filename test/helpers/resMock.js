'use strict'

const httpMocks = require('node-mocks-http')

module.exports = () => {
  return httpMocks.createResponse({
    eventEmitter: require('events').EventEmitter
  })
}
