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
    logger.debug(`[createUser - username: ${user.username}]`)

    const createUserSqlQuery = _createUserBuildSql(user)

    const { rows } = await db.getInstance().query(
      createUserSqlQuery.dbQuery,
      createUserSqlQuery.dbQueryValues
    )

    logger.debug(`[createUser - : ${user.username} - success]`)

    return rows
  } catch (error) {
    logger.debug(`[createUser - : ${user.username} - failed]`)

    // postgres unique violation
    if (error.code === '23505') {
      const message = error.constraint === 'user_username_key'
        ? `Username ${user.username} already exists.`
        : `Email ${user.email} already exists.`

      throw common.buildError(409, message)
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
  const dbQuery = `INSERT INTO "user" (username, email, password) VALUES ($1, $2, $3);`

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
    logger.debug(`[getUser - user id: ${idUser}]`)

    const getUserSqlQuery = _getUserBuildSql(idUser)

    const { rows } = await db.getInstance().query(
      getUserSqlQuery.dbQuery,
      getUserSqlQuery.dbQueryValues
    )

    if (!rows.length) {
      const message = `User does not exist`

      return Promise.reject(common.buildError(404, message))
    }

    logger.debug(`[getUser - : ${idUser} - success]`)

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
  const dbQuery = `SELECT id, username, email, id_photo, created_at FROM "user" WHERE "id" = $1;`
  const dbQueryValues = [ idUser ]

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
    logger.debug(`[deleteUser - user id: ${idUser}]`)

    const deleteUserSqlQuery = _deleteUserBuildSql(idUser)

    const result = await db.getInstance().query(
      deleteUserSqlQuery.dbQuery,
      deleteUserSqlQuery.dbQueryValues
    )

    if (!result.rowCount) {
      const message = `User does not exist`

      return Promise.reject(common.buildError(404, message))
    }

    logger.debug(`[deleteUser - : ${idUser} - success]`)

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
  const dbQuery = `DELETE FROM "user" WHERE "id" = $1;`
  const dbQueryValues = [ idUser ]

  return { dbQuery, dbQueryValues }
}

module.exports = {
  createUser,
  getUser,
  deleteUser
}
