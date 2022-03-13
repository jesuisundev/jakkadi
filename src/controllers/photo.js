'use strict'

const path = require('path')

const config = require(path.resolve('config/config.json'))
const logger = require(path.resolve('src/modules/logger')).generate(config, module.filename)
const photoModel = require(path.resolve('src/models/photo'))

/**
 *
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
async function listPhotos (req, res) {
  if (req.query && req.query.count) {
    await countPhoto(req, res)
  } else {
    try {
      // TODO - auth middleware
      const photos = await photoModel.listPhotos(req.query)

      res.status(200).json(photos)
    } catch (error) {
      logger.error(JSON.stringify(error))

      res.status(error.statusCode).json(error.output)
    }
  }
}

/**
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
async function getPhoto (req, res) {
  try {
    // TODO - auth middleware
    const photo = await photoModel.getPhoto(req.params.id_photo)

    res.status(200).json(photo)
  } catch (error) {
    logger.error(JSON.stringify(error))

    res.status(error.statusCode).json(error.output)
  }
}

/**
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
async function deletePhoto (req, res) {
  try {
    // TODO - auth middleware
    await photoModel.deletePhoto(req.params.id_photo)

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
async function postPhoto (req, res) {
  try {
    // TODO - auth middleware
    // TODO - s3 upload to get path
    await photoModel.createPhoto(req.body, 'path')

    res.status(201).json({})
  } catch (error) {
    logger.error(JSON.stringify(error))

    res.status(error.statusCode).json(error.output)
  }
}

/**
 * Function to count photo
 *
 * @param  {Object} req
 * @param  {Object} res
 * @returns {String}
 */
async function countPhoto (req, res) {
  try {
    // TODO - auth middleware
    const countPhoto = await photoModel.countPhoto()

    res.status(200).json(countPhoto[0])
  } catch (error) {
    logger.error(JSON.stringify(error))

    res.status(error.statusCode).json(error.output)
  }
}

module.exports = {
  listPhotos,
  getPhoto,
  deletePhoto,
  postPhoto,
  countPhoto
}
