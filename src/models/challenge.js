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
async function createChallenge (challenge) {
  try {
    logger.debug(`[createChallenge - name: ${challenge.name}]`)

    const createChallengeSqlQuery = _createChallengeBuildSql(challenge)
    
    const { rows } = await db.getInstance().query(
      createChallengeSqlQuery.dbQuery,
      createChallengeSqlQuery.dbQueryValues
    )

    logger.debug(`[createChallenge - : ${challenge.name} - success]`)

    return rows
  } catch (error) {
    logger.debug(`[createChallenge - : ${challenge.name} - failed]`)
    logger.error(JSON.stringify(error))
  
    throw common.buildError(500)
  }
}

/**
 * Create the SQL to create a challenge
 *
 * @param {Object} challenge challenge body object
 * @returns {Object}
 */
function _createChallengeBuildSql (challenge) {
  const dbQuery = `INSERT INTO "challenge" (name, description, date_start, date_end) VALUES ($1, $2, $3, $4);`
  const dbQueryValues = [
    challenge.name,
    challenge.description,
    challenge.date_start,
    challenge.date_end
  ]

  return { dbQuery, dbQueryValues }
}

/**
 * Get a challenge from the challenge object provided
 *
 * @async
 * @param {Object} challenge from the controller
 * @returns {Promise}
 */
async function getChallenge (idChallenge) {
  try {
    logger.debug(`[getChallenge - user id: ${idChallenge}]`)

    const getChallengeSqlQuery = _getChallengeBuildSql(idChallenge)

    const { rows } = await db.getInstance().query(
      getChallengeSqlQuery.dbQuery,
      getChallengeSqlQuery.dbQueryValues
    )

    if (!rows.length) {
      const message = `Challenge does not exist`

      return Promise.reject(common.buildError(404, message))
    }

    logger.debug(`[getChallenge - : ${idChallenge} - success]`)

    return rows[0]
  } catch (error) {
    logger.error(JSON.stringify(error))

    throw common.buildError(500)
  }
}

/**
 * Create the SQL to get a user
 *
 * @param {String} idChallenge user id
 * @returns {Object}
 */
function _getChallengeBuildSql (idChallenge) {
  const dbQuery = `SELECT id, name, description, date_start, date_end, created_at FROM "challenge" WHERE "id" = $1;`
  const dbQueryValues = [ idChallenge ]

  return { dbQuery, dbQueryValues }
}

/**
 * Get a user list from the query object provided
 *
 * @async
 * @param {Object} query from the controller
 * @returns {Promise}
 */
async function listChallenges (query) {
  try {
    logger.debug(`[listChallenges]`)

    // TODO - handle pagination with query (offset, limit)

    const getListChallengesSqlQuery = _getListChallengesBuildSql(query)

    const { rows } = await db.getInstance().query(
      getListChallengesSqlQuery.dbQuery,
      getListChallengesSqlQuery.dbQueryValues
    )

    logger.debug(`[listChallenges - success]`)

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
function _getListChallengesBuildSql (options) {
  const dbQuery = `SELECT id, name, description, date_start, date_end, created_at FROM "challenge" LIMIT 100;`
  const dbQueryValues = []

  return { dbQuery, dbQueryValues }
}

/**
 * Delete a user from the user object provided
 *
 * @async
 * @param {Integer} idChallenge id from the controller
 * @returns {Promise}
 */
async function deleteChallenge (idChallenge) {
  try {
    logger.debug(`[deleteChallenge - challenge id: ${idChallenge}]`)

    const deleteChallengeSqlQuery = _deleteChallengeBuildSql(idChallenge)

    const result = await db.getInstance().query(
      deleteChallengeSqlQuery.dbQuery,
      deleteChallengeSqlQuery.dbQueryValues
    )

    if (!result.rowCount) {
      const message = `Challenge does not exist`

      return Promise.reject(common.buildError(404, message))
    }

    logger.debug(`[deleteChallenge - : ${idChallenge} - success]`)

    return {}
  } catch (error) {
    logger.error(JSON.stringify(error))

    throw common.buildError(500)
  }
}

/**
 * Create the SQL to delete a user
 *
 * @param {String} idChallenge user id
 * @returns {Object}
 */
function _deleteChallengeBuildSql (idChallenge) {
  const dbQuery = `DELETE FROM "challenge" WHERE "id" = $1;`
  const dbQueryValues = [ idChallenge ]

  return { dbQuery, dbQueryValues }
}

/**
 * Count user
 *
 * @async
 * @returns {Promise}
 */
async function countChallenge () {
  try {
    logger.debug(`[countChallenge]`)

    // TODO - node-cache

    const getCountChallengesSqlQuery = _getCountChallengesBuildSql()

    const { rows } = await db.getInstance().query(
      getCountChallengesSqlQuery.dbQuery,
      getCountChallengesSqlQuery.dbQueryValues
    )

    logger.debug(`[countChallenge - success]`)

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
function _getCountChallengesBuildSql () {
  const dbQuery = `SELECT count(*) FROM "challenge";`
  const dbQueryValues = []

  return { dbQuery, dbQueryValues }
}

module.exports = {
  createChallenge,
  getChallenge,
  listChallenges,
  countChallenge,
  deleteChallenge
}
