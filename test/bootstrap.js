'use strict'
const mockery = require('mockery')
const Promise = require('bluebird')

Promise.config({
  cancellation: true
})

/**
 * Called during beforeEach of mocha tests.
 * Enables mockery
 */
function tearUp () {
  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false,
    useCleanCache: true
  })
}

/**
 * Called during afterEach of mocha tests.
 * Disables and clears mockery
 */
function tearDown () {
  mockery.deregisterAll()
  mockery.disable()
}

module.exports = {
  tearUp,
  tearDown
}
