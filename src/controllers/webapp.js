'use strict'

const path = require('path')
const Promise = require('bluebird')
const error4express = require('error4express')
const webappModel = require('../models/webapp')
const config = require('gap-configuration-resolver')
  .resolve(path.resolve('config/config.json'))
const logger = require('logger4express').generate(config, module.filename)

/**
 * Function that calls the model to get all the webapps.
 * If no webapps are found, an empty array is returned.
 *
 * @param {Object} req express request object
 * @param {Object} res express response object
 * @return {Promise(Array [webapp])}
 */
function listWebapps (req, res) {
  logger.debug(`listWebapps`)

  return Promise.try(() => {
    return webappModel.listWebapps(req.query)
  })

    .then(result => {
      logger.info(`listWebapps - success`)

      return res.status(200).json(result.rows)
    })

    .catch(err => {
      const payload = {
        info: {
          origin: 'Controllers - webapp.js - listWebapps() - catch'
        }
      }

      const verror = error4express.generateVError(err, payload)
      logger.error(verror)

      const httpError = error4express.generateHTTPErrorPayload(verror)

      return res.status(httpError.statusCode).json(httpError)
    })
}

/**
 * Function that calls the model to get a webapp and handles the result.
 *
 * @param {Object} req express request object
 * @param {Object} res express response object
 * @return {Promise(webapp)}
 */
function getWebapp (req, res) {
  logger.debug(`getWebapp`)

  return Promise.try(() => webappModel.getWebappById(req.params.webapp_id))

    .then(webapp => {
      logger.info(`getWebapp - success - webapp: ${JSON.stringify(webapp)}`)

      return res.status(200).json(webapp)
    })

    .catch(err => {
      const payload = {
        info: {
          origin: 'Controllers - webapp.js - getWebapp(id) - catch'
        }
      }

      const verror = error4express.generateVError(err, payload)
      logger.error(verror)

      const httpError = error4express.generateHTTPErrorPayload(verror)

      return res.status(httpError.statusCode).json(httpError)
    })
}

/**
 * Function that calls the model to delete the webapp and handles the result.
 *
 * @param {Object} req express request object
 * @param {Object} res express response object
 * @return {Promise(string)}
 */
function deleteWebapp (req, res) {
  logger.debug(`deleteWebapp`)

  return Promise.try(() => webappModel.deleteWebapp(req.params.webapp_id))

    .then(result => {
      logger.info(`deleteWebapp - success - result: ${JSON.stringify(result)}`)

      const confirmationMessage = `The webapp ${req.params.webapp_id} has been successfully deleted`

      // a string will be sent
      return res.status(result).send(confirmationMessage)
    })

    .catch(err => {
      const payload = {
        info: {
          origin: 'Controllers - webapp.js - deleteWebapp(id) - catch'
        }
      }

      const verror = error4express.generateVError(err, payload)
      const httpError = error4express.generateHTTPErrorPayload(verror)
      logger.error(verror)

      return res.status(httpError.statusCode).json(httpError)
    })
}

/**
 * Function that calls the model to create a webapp and returns the web app created
 *
 * @param {Object} req express request object
 * @param {Object} res express response object
 * @returns {Promise(webapp)}
 */
function createWebapp (req, res) {
  logger.debug(`createWebapp`)

  const webapp = req.body

  return Promise.try(() => webappModel.createWebapp(webapp))

    .then(result => {
      logger.info(`createWebapp - success - result: ${JSON.stringify(result)}`)

      return res.status(201).json(result)
    })

    .catch(err => {
      const payload = {
        info: {
          origin: 'Controllers - webapp.js - createWebapp(req, res) - catch'
        }
      }

      const verror = error4express.generateVError(err, payload)
      const httpError = error4express.generateHTTPErrorPayload(verror)
      logger.error(verror)

      return res.status(httpError.statusCode).json(httpError)
    })
}

/**
 * Function to update a webapp in the database.
 *
 * @param  {Object} req
 * @param  {Object} res
 * @returns {Promise(webapp)}
 */
function updateWebapp (req, res) {
  logger.debug(`updateWebapp`)

  let webapp = req.body
  webapp.id = req.params.webapp_id

  return Promise.try(() => webappModel.updateWebapp(webapp))

    .then(result => {
      logger.info(`updateWebapp - success - result: ${JSON.stringify(result)}`)

      return res.status(200).json(result)
    })

    .catch(err => {
      const payload = {
        info: {
          origin: 'Controllers - webapp.js - updateWebapp(req, res) - catch'
        }
      }

      const verror = error4express.generateVError(err, payload)
      logger.error(verror)

      const httpError = error4express.generateHTTPErrorPayload(verror)

      return res.status(httpError.statusCode).json(httpError)
    })
}

module.exports = {
  listWebapps,
  getWebapp,
  deleteWebapp,
  createWebapp,
  updateWebapp
}
