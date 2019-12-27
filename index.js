'use strict'

const path = require('path')
const config = require(path.join(__dirname, '/config/config.json'))
const logger = require(path.join(__dirname, '/src/modules/logger.js')).generate(config, 'index')
const app = require(path.join(__dirname, '/src/bootstrap.js'))(config)

const server = app.listen(config.port, () => {
  logger.info(`Server on port ${config.port}`)
})

module.export = server
