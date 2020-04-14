'use strict'

const path = require('path')

const config = require(path.resolve('config/config.json'))
const logger = require(path.resolve('src/modules/logger')).generate(config, module.filename)
const userModel = require(path.resolve('src/models/user'))

/**
 *
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
async function listUsers (req, res) {
  try {
    logger.debug(`listUsers`)

    return []
  } catch (error) {
    logger.debug(error)

    throw new Error(error)
  }
}

/**
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
async function getUser (req, res) {
  try {
    logger.debug(`getUser`)

    // TODO - auth middleware

    const user = await userModel.getUser(req.params.id_user)

    res.status(200).json(user)
  } catch (error) {
    logger.error(JSON.stringify(error))

    res.status(error.statusCode).json(error.output)
  }
}

/**
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
async function deleteUser (req, res) {
  try {
    logger.debug(`getUser`)

    // TODO - auth middleware

    await userModel.deleteUser(req.params.id_user)

    res.status(204).json({})
  } catch (error) {
    logger.error(JSON.stringify(error))

    res.status(error.statusCode).json(error.output)
  }
}

/**
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
async function postUser (req, res) {
  try {
    logger.debug(`postUser`)

    // TODO - auth middleware

    await userModel.createUser(req.body)

    res.status(201).json({})
  } catch (error) {
    logger.error(JSON.stringify(error))

    res.status(error.statusCode).json(error.output)
  }
}

/**
 * Function to update a webapp in the database.
 *
 * @param  {Object} req
 * @param  {Object} res
 * @returns {Promise(webapp)}
 */
async function countUser (req, res) {
  try {
    logger.debug(`countUser`)

    return []
  } catch (error) {
    logger.debug(error)

    throw new Error(error)
  }
}

module.exports = {
  listUsers,
  getUser,
  deleteUser,
  postUser,
  countUser
}
