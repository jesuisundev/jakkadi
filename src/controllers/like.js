'use strict'

const path = require('path')

const config = require(path.resolve('config/config.json'))
const logger = require(path.resolve('src/modules/logger')).generate(config, module.filename)
const likeModel = require(path.resolve('src/models/like'))
const common = require(path.resolve('src/modules/common'))

/**
 * Function to count like
 *
 * @param  {Object} req
 * @param  {Object} res
 * @returns {String}
 */
async function countLike (req, res) {
  try {
    logger.debug(`countLike`)

    // TODO - auth middleware

    const countLike = await likeModel.countLike()

    res.status(200).json(countLike[0])
  } catch (error) {
    logger.error(JSON.stringify(error))

    res.status(error.statusCode).json(error.output)
  }
}

/**
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
async function getLike (req, res) {
  try {
    logger.debug(`getLike`)

    // TODO - auth middleware

    const like = await likeModel.getLike(req.params.id_like)

    res.status(200).json(like)
  } catch (error) {
    logger.error(JSON.stringify(error))

    res.status(error.statusCode).json(error.output)
  }
}

async function getLikesByPhoto (req, res) {
  try {
    logger.debug(`getLikesByPhoto`)

    // TODO - auth middleware

    let likes
    const cachedLikesByPhoto = await common.getAsyncCache(`likes:photos:${req.params.id_photo}`)

    if (cachedLikesByPhoto) {
      likes = cachedLikesByPhoto
    } else {
      likes = await await likeModel.getLikesByPhoto(req.params.id_photo)
      await common.setAsyncCache(`likes:photos:${req.params.id_photo}`, likes)
    }

    res.status(200).json(likes)
  } catch (error) {
    logger.error(JSON.stringify(error))

    res.status(error.statusCode).json(error.output)
  }
}

/**
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
async function deleteLike (req, res) {
  try {
    logger.debug(`deleteLike`)

    // TODO - auth middleware

    await likeModel.deleteLike(req.params.id_like)

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
async function postLike (req, res) {
  try {
    logger.debug(`postLike`)

    // TODO - auth middleware

    await likeModel.createLike(req.body)
    await common.delAsyncCache([`likes:photos:${req.body.id_photo}`])

    res.status(201).json({})
  } catch (error) {
    logger.error(JSON.stringify(error))

    res.status(error.statusCode).json(error.output)
  }
}

module.exports = {
  postLike,
  deleteLike,
  getLike,
  getLikesByPhoto,
  countLike
}
