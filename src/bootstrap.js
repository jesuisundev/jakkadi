'use strict'

const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const os = require('os')
const route4express = require('route4express')
const joi4express = require('joi4express')
const lout4express = require('lout4express')

module.exports = function (config) {
  if (!config) {
    throw new Error('No configuration passed to the initialisation step')
  } else {
    const logger = require(path.join(__dirname, '/modules/logger.js')).generate(config, 'bootstrap')
    const app = express()

    app.use(bodyParser.json())

    // Loading the API routes
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
      const payload = {
        info: {
          message: 'expressjs middleware global error',
          origin: 'Bootstrap.js - global express error handler'
        }
      }

      logger.error(err)

      res.status(500).json(payload)
    })

    return app
  }
}
