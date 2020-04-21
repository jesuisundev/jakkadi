'use strict'

const winston = require('winston')

/**
 * Generate configuration object from Winston
 * @param {object} config object containing app configuration
 * @param {filename} filename name of the file logged
 *
 * @return Object
 */
function generate (config, filename) {
  const logger = winston.createLogger({
    level: config.logger.logLevel,
    format: winston.format.json(),
    label: filename,
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  })

  /* istanbul ignore next if */
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({ format: winston.format.simple() }))
  }

  return logger
}

module.exports = {
  generate
}
