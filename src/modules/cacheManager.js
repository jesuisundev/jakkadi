'use strict'

const path = require('path')
const Promise = require('bluebird')
const NodeCache = require('node-cache')
Promise.promisifyAll(NodeCache.prototype)

let cacheSingleton = (() => {
  const config = require(path.resolve('config/config.json'))

  // Instance stores a reference to the Singleton
  let instance

  /**
   * Initialises the internal cache
   */
  function init () {
    const cache = new NodeCache(config.cache.internal)

    return cache
  }

  return {
    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance: () => {
      if (!instance) {
        instance = init()
      }
      return instance
    },

    close: () => {
      let returnPromise = Promise.resolve()

      if (instance) {
        returnPromise = instance.closeAsync()

          .then(() => {
            instance = null
          })
      }

      return returnPromise
    }
  }
})()

module.exports = {
  cacheSingleton
}
