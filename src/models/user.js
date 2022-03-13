'use strict'

const path = require('path')
const db = require(path.resolve('src/modules/pg-manager'))
const config = require(path.resolve('config/config.json'))
const logger = require(path.resolve('src/modules/logger')).generate(config, module.filename)
const common = require(path.resolve('src/modules/common'))

/**
 * Create a user from the user object provided
 *
 * @async
 * @param {Object} user from the controller
 * @returns {Promise}
 */
async function createUser (user) {
  try {
    const createUserSqlQuery = _createUserBuildSql(user)
    const { rows } = await db.getInstance().query(
      createUserSqlQuery.dbQuery,
      createUserSqlQuery.dbQueryValues
    )

    return rows
  } catch (error) {
    // postgres unique violation code
    if (error.code === '23505') {
      throw common.buildError(409, 'Email and/or username already exists.')
    }

    throw common.buildError(500)
  }
}

/**
 * Create the SQL to create a user
 *
 * @param {Object} user user body object
 * @returns {Object}
 */
function _createUserBuildSql (user) {
  const dbQuery = 'INSERT INTO "user" (username, email, password) VALUES ($1, $2, $3);'

  // TODO - encode password

  const dbQueryValues = [
    user.username,
    user.email,
    user.password
  ]

  return { dbQuery, dbQueryValues }
}

/**
 * Get a user from the user object provided
 *
 * @async
 * @param {Object} user from the controller
 * @returns {Promise}
 */
async function getUser (idUser) {
  try {
    const getUserSqlQuery = _getUserBuildSql(idUser)
    const { rows } = await db.getInstance().query(
      getUserSqlQuery.dbQuery,
      getUserSqlQuery.dbQueryValues
    )

    if (!rows.length) {
      return Promise.reject(common.buildError(404, 'User does not exist'))
    }

    return rows[0]
  } catch (error) {
    logger.error(JSON.stringify(error))

    throw common.buildError(500)
  }
}

/**
 * Create the SQL to get a user
 *
 * @param {String} idUser user id
 * @returns {Object}
 */
function _getUserBuildSql (idUser) {
  const dbQuery = 'SELECT id, username, email, id_photo, created_at FROM "user" WHERE "id" = $1;'
  const dbQueryValues = [idUser]

  return { dbQuery, dbQueryValues }
}

/**
 * Get a user list from the query object provided
 *
 * @async
 * @param {Object} query from the controller
 * @returns {Promise}
 */
async function listUsers (query) {
  try {
    // TODO - handle pagination with query (offset, limit)
    const getListUsersSqlQuery = _getListUsersBuildSql(query)
    const { rows } = await db.getInstance().query(
      getListUsersSqlQuery.dbQuery,
      getListUsersSqlQuery.dbQueryValues
    )

    return rows
  } catch (error) {
    logger.error(JSON.stringify(error))

    throw common.buildError(500)
  }
}

/**
 * Create the SQL to get a users list
 *
 * @param {String} options user id
 * @returns {Object}
 */
function _getListUsersBuildSql (options) {
  const dbQuery = 'SELECT id, username, email, id_photo, created_at FROM "user" LIMIT 100;'
  const dbQueryValues = []

  return { dbQuery, dbQueryValues }
}

/**
 * Delete a user from the user object provided
 *
 * @async
 * @param {Integer} idUser id from the controller
 * @returns {Promise}
 */
async function deleteUser (idUser) {
  try {
    const deleteUserSqlQuery = _deleteUserBuildSql(idUser)
    const result = await db.getInstance().query(
      deleteUserSqlQuery.dbQuery,
      deleteUserSqlQuery.dbQueryValues
    )

    if (!result.rowCount) {
      return Promise.reject(common.buildError(404, 'User does not exist'))
    }

    return {}
  } catch (error) {
    logger.error(JSON.stringify(error))

    throw common.buildError(500)
  }
}

/**
 * Create the SQL to delete a user
 *
 * @param {String} idUser user id
 * @returns {Object}
 */
function _deleteUserBuildSql (idUser) {
  const dbQuery = 'DELETE FROM "user" WHERE "id" = $1;'
  const dbQueryValues = [idUser]

  return { dbQuery, dbQueryValues }
}

/**
 * Count user
 *
 * @async
 * @returns {Promise}
 */
async function countUser () {
  try {
    const getCountUsersSqlQuery = _getCountUsersBuildSql()
    const { rows } = await db.getInstance().query(
      getCountUsersSqlQuery.dbQuery,
      getCountUsersSqlQuery.dbQueryValues
    )

    return rows
  } catch (error) {
    logger.error(JSON.stringify(error))

    throw common.buildError(500)
  }
}

/**
 * Create the SQL to count users
 *
 * @param {String} options user id
 * @returns {Object}
 */
function _getCountUsersBuildSql () {
  const dbQuery = 'SELECT count(*) FROM "user";'
  const dbQueryValues = []

  return { dbQuery, dbQueryValues }
}

module.exports = {
  createUser,
  getUser,
  listUsers,
  countUser,
  deleteUser
}
