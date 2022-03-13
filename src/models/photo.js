'use strict'

const path = require('path')
const db = require(path.resolve('src/modules/pg-manager'))
const config = require(path.resolve('config/config.json'))
const logger = require(path.resolve('src/modules/logger')).generate(config, module.filename)
const common = require(path.resolve('src/modules/common'))

/**
 * Create a photo from the photo object provided
 *
 * @async
 * @param {Object} photo from the controller
 * @param {String} path from the controller
 * @returns {Promise}
 */
async function createPhoto (photo, path) {
  try {
    const createPhotoSqlQuery = _createPhotoBuildSql(photo, path)
    const { rows } = await db.getInstance().query(
      createPhotoSqlQuery.dbQuery,
      createPhotoSqlQuery.dbQueryValues
    )

    return rows
  } catch (error) {
    // postgres unique violation code
    if (error.code === '23505') {
      throw common.buildError(409, 'Photo already exist.')
    }

    throw common.buildError(500)
  }
}

/**
 * Create the SQL to create a photo
 *
 * @param {Object} photo photo body object
 * @param {String} path from the controller
 * @returns {Object}
 */
function _createPhotoBuildSql (photo, path) {
  const dbQuery = 'INSERT INTO "photo" (id_user, id_challenge, description, path) VALUES ($1, $2, $3, $4);'
  const dbQueryValues = [
    photo.id_user,
    photo.id_challenge,
    photo.description,
    path
  ]

  return { dbQuery, dbQueryValues }
}

/**
 * Get a photo from the photo object provided
 *
 * @async
 * @param {Object} photo from the controller
 * @returns {Promise}
 */
async function getPhoto (idPhoto) {
  try {
    const getPhotoSqlQuery = _getPhotoBuildSql(idPhoto)
    const { rows } = await db.getInstance().query(
      getPhotoSqlQuery.dbQuery,
      getPhotoSqlQuery.dbQueryValues
    )

    if (!rows.length) {
      return Promise.reject(common.buildError(404, 'Photo does not exist'))
    }

    return rows[0]
  } catch (error) {
    logger.error(JSON.stringify(error))

    throw common.buildError(500)
  }
}

/**
 * Create the SQL to get a photo
 *
 * @param {String} idPhoto photo id
 * @returns {Object}
 */
function _getPhotoBuildSql (idPhoto) {
  const dbQuery = 'SELECT id, id_user, id_challenge, description, path, created_at FROM "photo" WHERE "id" = $1;'
  const dbQueryValues = [idPhoto]

  return { dbQuery, dbQueryValues }
}

/**
 * Get a photo list from the query object provided
 *
 * @async
 * @param {Object} query from the controller
 * @returns {Promise}
 */
async function listPhotos (query) {
  try {
    // TODO - handle pagination with query (offset, limit)
    const getListPhotosSqlQuery = _getListPhotosBuildSql(query)
    const { rows } = await db.getInstance().query(
      getListPhotosSqlQuery.dbQuery,
      getListPhotosSqlQuery.dbQueryValues
    )

    return rows
  } catch (error) {
    logger.error(JSON.stringify(error))

    throw common.buildError(500)
  }
}

/**
 * Create the SQL to get a photos list
 *
 * @param {String} options photo id
 * @returns {Object}
 */
function _getListPhotosBuildSql (options) {
  const dbQuery = 'SELECT id, id_user, id_challenge, description, path, created_at FROM "photo" LIMIT 100;'
  const dbQueryValues = []

  return { dbQuery, dbQueryValues }
}

/**
 * Delete a photo from the photo object provided
 *
 * @async
 * @param {Integer} idPhoto id from the controller
 * @returns {Promise}
 */
async function deletePhoto (idPhoto) {
  try {
    const deletePhotoSqlQuery = _deletePhotoBuildSql(idPhoto)
    const result = await db.getInstance().query(
      deletePhotoSqlQuery.dbQuery,
      deletePhotoSqlQuery.dbQueryValues
    )

    if (!result.rowCount) {
      return Promise.reject(common.buildError(404, 'Photo does not exist'))
    }

    return {}
  } catch (error) {
    logger.error(JSON.stringify(error))

    throw common.buildError(500)
  }
}

/**
 * Create the SQL to delete a photo
 *
 * @param {String} idPhoto photo id
 * @returns {Object}
 */
function _deletePhotoBuildSql (idPhoto) {
  const dbQuery = 'DELETE FROM "photo" WHERE "id" = $1;'
  const dbQueryValues = [idPhoto]

  return { dbQuery, dbQueryValues }
}

/**
 * Count photo
 *
 * @async
 * @returns {Promise}
 */
async function countPhoto () {
  try {
    const getCountPhotosSqlQuery = _getCountPhotosBuildSql()
    const { rows } = await db.getInstance().query(
      getCountPhotosSqlQuery.dbQuery,
      getCountPhotosSqlQuery.dbQueryValues
    )

    return rows
  } catch (error) {
    logger.error(JSON.stringify(error))

    throw common.buildError(500)
  }
}

/**
 * Create the SQL to count photos
 *
 * @param {String} options photo id
 * @returns {Object}
 */
function _getCountPhotosBuildSql () {
  const dbQuery = 'SELECT count(*) FROM "photo";'
  const dbQueryValues = []

  return { dbQuery, dbQueryValues }
}

module.exports = {
  createPhoto,
  getPhoto,
  listPhotos,
  countPhoto,
  deletePhoto
}
