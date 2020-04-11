'use strict'
const { Pool } = require('pg')

const _defaultLogger = {
  debug: (msg) => console.log(msg),
  error: (msg) => console.log(msg),
  warn: (msg) => console.log(msg)
}

/**
 * Return an object for managing pg operation inside your backend
 *  - configure(config): load config for pg lib
 *  - getInstance(): singleton that return a current instance of pg lib
 *  - getConfig(): simple helper for get current loaded configuration (useful for tests)
 *  - close(): close pool
 *
 * @return {Object}
 */
function pgManager () {
  let _config = null
  let _logger = null
  let instance = null

  function init () {
    if (!_config) {
      throw new Error('You need to pass a configuration through "configure(config)" in bootstrap.js')
    } else {
      const pool = new Pool(_config)
      _logger.debug(`init() called`)

      // https://github.com/brianc/node-postgres/issues/1324
      pool.on('error', (err) => {
        _logger.error(`pool.on('error'): (An idle client has experienced an error): ${err.message}`)
        _logger.error(err.stack)
      })

      return pool
    }
  }

  return {
    configure: (config, logger) => {
      _config = config
      _logger = logger || _defaultLogger
    },
    getConfig: () => {
      return _config
    },
    getInstance: () => {
      if (!instance) {
        instance = init()
      }
      return instance
    },
    close: () => {
      let returnPromise = Promise.resolve()

      if (instance) {
        returnPromise = instance.end()

          .then(() => {
            _logger.warn('Postgres Pool has been ended as requested')
            instance = null
          })
      }

      return returnPromise
    }
  }
}

module.exports = exports = pgManager()
