'use strict'

const path = require('path')
const db = require(path.resolve('src/modules/pg-manager'))
const config = require(path.resolve('config/config.json'))
const logger = require(path.resolve('src/modules/logger')).generate(config, module.filename)

/**
 * Create a user from the user object provided
 *
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

    return rows[0]
  } catch (error) {
    logger.debug(`[createUser - : ${user.username} - failed]`)

    throw error
  }
}

function _createUserBuildSql (user) {
  // TODO - encode password
  const dbQuery = `INSERT INTO user (username, email, password) VALUES ($1, $2, $3) RETURNING *;`

  const dbQueryValues = [
    user.username,
    user.email,
    user.password
  ]

  return { dbQuery, dbQueryValues }
}

module.exports = {
  createUser
}
