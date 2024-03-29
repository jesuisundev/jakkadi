'use strict'

const path = require('path')
const db = require(path.resolve('src/modules/pg-manager'))
const express = require('express')
const bodyParser = require('body-parser')
const os = require('os')
const route4express = require('route4express')
const joi4express = require(path.resolve('src/modules/joi4express'))
const lout4express = require('lout4express')

module.exports = function (config) {
  if (!config) {
    throw new Error('No configuration passed to the initialisation step')
  } else {
    const logger = require(path.join(__dirname, '/modules/logger.js')).generate(config, 'bootstrap')

    // configure pg manager
    db.configure(config.postgres, logger)

    const app = express()

    app.use(bodyParser.json())

    let routes = route4express(path.join(__dirname, '/routes'), config.basePath)

    routes = routes.map(route => {
      app[route.method](route.url, joi4express(route, null))

      return route
    })

    app.all('/', lout4express(routes, os.hostname()))

    /**
     * Error middleware
     * if an error is triggered
     * This is used as an additional layer of protection even if errors are
     * already managed in this application.
     *
     * @param  {Error}  err   error
     * @param  {Object} req   request
     * @param  {Object} res   response
     * @param  {Object} next  next middleware to call
     * @return {Object}       server response
     */
    app.use((err, req, res, next) => {
      logger.debug('[global express error handler]')
      const finalError = {
        output: {}
      }

      if (err.isBoom) {
        finalError.statusCode = err.output.statusCode
        finalError.output = err.output
      } else if (err.statusCode) {
        finalError.statusCode = err.statusCode
        finalError.output = err
      }

      logger.error(JSON.stringify(finalError))

      res.status(finalError.statusCode).json(finalError.output)
    })

    return app
  }
}
