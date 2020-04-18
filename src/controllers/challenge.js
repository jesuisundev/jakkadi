'use strict'

const path = require('path')

const config = require(path.resolve('config/config.json'))
const logger = require(path.resolve('src/modules/logger')).generate(config, module.filename)
const challengeModel = require(path.resolve('src/models/challenge'))

/**
 *
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
async function listChallenges (req, res) {
  if (req.query && req.query.count) {
    await countChallenge(req, res)
  } else {
    try {
      logger.debug(`listChallenges`)

      // TODO - auth middleware

      const challenges = await challengeModel.listChallenges(req.query)

      res.status(200).json(challenges)
    } catch (error) {
      logger.error(JSON.stringify(error))

      res.status(error.statusCode).json(error.output)
    }
  }
}

/**
 * Function to count challenge
 *
 * @param  {Object} req
 * @param  {Object} res
 * @returns {String}
 */
async function countChallenge (req, res) {
  try {
    logger.debug(`countChallenge`)

    // TODO - auth middleware

    const countChallenge = await challengeModel.countChallenge()

    res.status(200).json(countChallenge[0])
  } catch (error) {
    logger.error(JSON.stringify(error))

    res.status(error.statusCode).json(error.output)
  }
}

/**
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
async function getChallenge (req, res) {
  try {
    logger.debug(`getChallenge`)

    // TODO - auth middleware

    const challenge = await challengeModel.getChallenge(req.params.id_challenge)

    res.status(200).json(challenge)
  } catch (error) {
    logger.error(JSON.stringify(error))

    res.status(error.statusCode).json(error.output)
  }
}

/**
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
async function deleteChallenge (req, res) {
  try {
    logger.debug(`deleteChallenge`)

    // TODO - auth middleware

    await challengeModel.deleteChallenge(req.params.id_challenge)

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
async function postChallenge (req, res) {
  try {
    logger.debug(`postChallenge`)

    // TODO - auth middleware

    await challengeModel.createChallenge(req.body)

    res.status(201).json({})
  } catch (error) {
    logger.error(JSON.stringify(error))

    res.status(error.statusCode).json(error.output)
  }
}


module.exports = {
  postChallenge,
  listChallenges,
  deleteChallenge,
  getChallenge,
  countChallenge
}
