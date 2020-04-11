'use strict'

const path = require('path')
const config = require(path.resolve('config/config.json'))
const logger = require(path.resolve('src/modules/logger')).generate(config, module.filename)

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
async function deleteUser (req, res) {
  try {
    logger.debug(`deleteUser`)

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
async function postUser (req, res) {
  try {
    logger.debug(`postUser`)

    res.status(201).json({})
  } catch (error) {
    logger.debug(error)

    res.status(500).json(error)
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
