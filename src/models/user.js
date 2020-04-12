'use strict'

const path = require('path')
const db = require(path.resolve('src/modules/pg-manager'))
const config = require(path.resolve('config/config.json'))
const logger = require(path.resolve('src/modules/logger')).generate(config, module.filename)
const common = require(path.resolve('src/modules/common'))

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

module.exports = {
  createUser
}
