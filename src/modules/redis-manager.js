'use strict'

const Redis = require('ioredis')
const Redlock = require('redlock')
Redis.Promise = require('bluebird')

// used when hz-logger is not passed
const _defaultLogger = {
  debug: msg => {},
  error: msg => {},
  warn: msg => {}
}

/**
 * Return an object for managing redis operation inside your backend
 *  - configure(config): configure the Redis lib
 *  - getInstance(): singleton that returns the current instance of the Redis lib
 *  - getConfig(): simple helper to get the configuration that's loaded into the modulen
 *  (useful for tests)
 *  - close(): close redis connection
 *
 * @return {Object}
 */
function redisManager () {
  let _config = null
  let _logger = null
  let instance = null

  /**
   * initialize Redis client
   * @return {Object} Redis client
   */
  const _init = () => {
    /* istanbul ignore if */ // The cake is a lie! This line is covered, but somehow nyc does not report it
    if (!_config) {
      throw new Error('You need to pass a configuration through "configure(config)" in bootstrap.js')
    } else {
      _logger.debug(`Redis client init() called`)
      let client = null
      const { port, host, password, maxRetriesPerRequest = 1 } = _config.redis

      client = new Redis({
        port,
        host,
        password,
        maxRetriesPerRequest,
        showFriendlyErrorStack: true,
        enableOfflineQueue: false
      })

      client.on('reconnecting', () => {
        _logger.error('Redis client reconnecting event.')
      })

      client.on('end', () => {
        _logger.error('Redis client end event.')
        instance = null
      })

      client.on('error', err => {
        _logger.error('Redis client connection error', err)
      })

      return client
    }
  }

  /**
   * get redis instance
   * @return {Object}
   */
  const _getInstance = () => {
    /* istanbul ignore else */
    if (!instance) {
      instance = _init()
    }

    return instance
  }

  /**
   * close redis connection
   * @return {Promise}
   */
  const _close = async () => {
    /* istanbul ignore else */
    if (instance) {
      await instance.quit()

      _logger.warn('Redis Connection has been ended as requested')
    }
  }

  /**
   * Returns a configured redlock object to manage redis locks
   * @return {Object} redlock object
   */
  const _redlock = () => {
    const { driftFactor, retryCount, retryDelay, retryJitter } = _config.redlock
    return new Redlock(
      // you should have one client for each independent redis node or cluster
      [_getInstance()],
      {
        // the expected clock drift; for more details, ee http://redis.io/topics/distlock
        driftFactor, // time in ms

        // the max number of times Redlock will attempt to lock a resource before erroring
        retryCount,

        // the time in ms between attempts
        retryDelay, // time in ms

        // the max time in ms randomly added to retries to improve performance under high contention
        // see https://www.awsarchitectureblog.com/2015/03/backoff.html
        retryJitter // time in ms
      }
    )
  }

  return {
    configure: (config, logger) => {
      _config = config
      _logger = logger || _defaultLogger
    },
    getConfig: () => {
      return _config
    },
    getInstance: _getInstance,
    close: _close,
    redlock: _redlock
  }
}

module.exports = exports = redisManager()
