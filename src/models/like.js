'use strict'

const path = require('path')
const db = require(path.resolve('src/modules/pg-manager'))
const config = require(path.resolve('config/config.json'))
const logger = require(path.resolve('src/modules/logger')).generate(config, module.filename)
const common = require(path.resolve('src/modules/common'))

/**
 * Create a like from the like object provided
 *
 * @async
 * @param {Object} like from the controller
 * @returns {Promise}
 */
async function createLike (like) {
  try {
    const createLikeSqlQuery = _createLikeBuildSql(like)
    const { rows } = await db.getInstance().query(
      createLikeSqlQuery.dbQuery,
      createLikeSqlQuery.dbQueryValues
    )

    return rows
  } catch (error) {
    if (error.code === '23505') {
      throw common.buildError(409, `Like already exists.`)
    }

    throw common.buildError(500)
  }
}

/**
 * Create the SQL to create a like
 *
 * @param {Object} like like body object
 * @returns {Object}
 */
function _createLikeBuildSql (like) {
  const dbQuery = 'INSERT INTO "like" (id_user, id_photo) VALUES ($1, $2);'
  const dbQueryValues = [
    like.id_user,
    like.id_photo
  ]

  return { dbQuery, dbQueryValues }
}

/**
 * Get a like from the like object provided
 *
 * @async
 * @param {Object} like from the controller
 * @returns {Promise}
 */
async function getLike (idLike) {
  try {
    const getLikeSqlQuery = _getLikeBuildSql(idLike)
    const { rows } = await db.getInstance().query(
      getLikeSqlQuery.dbQuery,
      getLikeSqlQuery.dbQueryValues
    )

    if (!rows.length) {
      return Promise.reject(common.buildError(404, 'Like does not exist'))
    }

    return rows[0]
  } catch (error) {
    logger.error(JSON.stringify(error))

    throw common.buildError(500)
  }
}

/**
 * Create the SQL to get a like
 *
 * @param {String} idLike like id
 * @returns {Object}
 */
function _getLikeBuildSql (idLike) {
  const dbQuery = 'SELECT id, id_user, id_photo, created_at FROM "like" WHERE "id" = $1;'
  const dbQueryValues = [idLike]

  return { dbQuery, dbQueryValues }
}

/**
 * Delete a like from the like object provided
 *
 * @async
 * @param {Integer} idLike id from the controller
 * @returns {Promise}
 */
async function deleteLike (idLike) {
  try {
    const deleteLikeSqlQuery = _deleteLikeBuildSql(idLike)
    const result = await db.getInstance().query(
      deleteLikeSqlQuery.dbQuery,
      deleteLikeSqlQuery.dbQueryValues
    )

    if (!result.rowCount) {
      return Promise.reject(common.buildError(404, 'Like does not exist'))
    }

    return {}
  } catch (error) {
    logger.error(JSON.stringify(error))

    throw common.buildError(500)
  }
}

/**
 * Create the SQL to delete a like
 *
 * @param {String} idLike like id
 * @returns {Object}
 */
function _deleteLikeBuildSql (idLike) {
  const dbQuery = 'DELETE FROM "like" WHERE "id" = $1;'
  const dbQueryValues = [idLike]

  return { dbQuery, dbQueryValues }
}

/**
 * Count like
 *
 * @async
 * @returns {Promise}
 */
async function countLike () {
  try {
    const getCountLikesSqlQuery = _getCountLikesBuildSql()
    const { rows } = await db.getInstance().query(
      getCountLikesSqlQuery.dbQuery,
      getCountLikesSqlQuery.dbQueryValues
    )

    return rows
  } catch (error) {
    logger.error(JSON.stringify(error))

    throw common.buildError(500)
  }
}

/**
 * Create the SQL to count likes
 *
 * @param {String} options like id
 * @returns {Object}
 */
function _getCountLikesBuildSql () {
  const dbQuery = 'SELECT count(*) FROM "like";'
  const dbQueryValues = []

  return { dbQuery, dbQueryValues }
}

module.exports = {
  createLike,
  getLike,
  countLike,
  deleteLike
}
