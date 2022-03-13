'use strict'

const path = require('path')

const config = require(path.resolve('config/config.json'))
const logger = require(path.resolve('src/modules/logger')).generate(config, module.filename)
const challengeModel = require(path.resolve('src/models/challenge'))
const common = require(path.resolve('src/modules/common'))

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
    // TODO - auth middleware
    const challenge = await challengeModel.getChallenge(req.params.id_challenge)

    res.status(200).json(challenge)
  } catch (error) {
    logger.error(JSON.stringify(error))

    res.status(error.statusCode).json(error.output)
  }
}

async function getPhotosByChallenge (req, res) {
  try {
    // TODO - auth middleware
    let challenge
    const cachedPhotosByChallenge = await common.getAsyncCache(`challenge:photos:${req.params.id_challenge}`)

    if (cachedPhotosByChallenge) {
      challenge = cachedPhotosByChallenge
    } else {
      challenge = await challengeModel.getPhotosByChallenge(req.params.id_challenge)
      await common.setAsyncCache(`challenge:photos:${req.params.id_challenge}`, challenge)
    }

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
async function getCurrentChallenge (req, res) {
  try {
    let challenge = {}
    const cachedCurrentChallenge = await common.getAsyncCache(`challenge:current`)

    if (cachedCurrentChallenge) {
      challenge = cachedCurrentChallenge
    } else {
      challenge = await challengeModel.getCurrentChallenge()
      await common.setAsyncCache(`challenge:current`, challenge)
    }

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
    await challengeModel.createChallenge(req.body)
    await common.delAsyncCache([`challenge:current`])

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
  getCurrentChallenge,
  getPhotosByChallenge,
  countChallenge
}
