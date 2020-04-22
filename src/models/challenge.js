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
 * Get the current challenge
 *
 * @async
 * @returns {Promise}
 */
async function getCurrentChallenge () {
  try {
    logger.debug(`[getCurrentChallenge - model]`)

    const getCurrentChallengeSqlQuery = _getCurrentChallengeBuildSql()

    const { rows } = await db.getInstance().query(
      getCurrentChallengeSqlQuery.dbQuery,
      getCurrentChallengeSqlQuery.dbQueryValues
    )

    if (!rows.length) {
      const message = `Current challenge does not exist`

      return Promise.reject(common.buildError(404, message))
    }

    logger.debug(`[getCurrentChallenge - models - success]`)

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
function _getCurrentChallengeBuildSql () {
  const dbQuery = `SELECT id, name, description, date_start, date_end, created_at 
                   FROM "challenge" 
                   WHERE "date_start" <= now()
                   AND "date_end" >= now();`

  const dbQueryValues = []

  return { dbQuery, dbQueryValues }
}

/**
 * Get a challenge list from the query object provided
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
 * Get a photo list by challenge from the query object provided
 *
 * @async
 * @param {string} idChallenge from the controller
 * @returns {Promise}
 */
async function getPhotosByChallenge (idChallenge) {
  try {
    logger.debug(`[getPhotosByChallenge]`)

    // TODO - handle pagination with query (offset, limit)

    const getPhotoListChallengesSqlQuery = _getListPhotosByChallengeBuildSql(idChallenge)

    const { rows } = await db.getInstance().query(
      getPhotoListChallengesSqlQuery.dbQuery,
      getPhotoListChallengesSqlQuery.dbQueryValues
    )

    logger.debug(`[getPhotosByChallenge - success]`)

    return rows
  } catch (error) {
    logger.error(JSON.stringify(error))

    throw common.buildError(500)
  }
}

/**
 * Create the SQL to get a photo list by challenge
 *
 * @param {String} options
 * @returns {Object}
 */
function _getListPhotosByChallengeBuildSql (idChallenge) {
  const dbQuery = `SELECT id, id_user, id_challenge, description, path, created_at 
                  FROM "photo" 
                  WHERE "id_challenge" = $1
                  LIMIT 100;`
  const dbQueryValues = [ idChallenge ]

  return { dbQuery, dbQueryValues }
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
  getCurrentChallenge,
  getPhotosByChallenge,
  listChallenges,
  countChallenge,
  deleteChallenge
}
