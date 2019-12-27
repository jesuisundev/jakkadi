'use strict'

const path = require('path')
const Promise = require('bluebird')
const error4express = require('error4express')
const _ = require('lodash')
const db = require('hz-pg-manager')
const cacheManager = require('hz-redis-manager')
const common = require('../modules/common')
const config = require('gap-configuration-resolver')
  .resolve(path.resolve('config/config.json'))
const logger = require('logger4express').generate(config, module.filename)

/**
 * List all webapps from the Postgres database
 *
 * @param {Object} params REST params from the request
 * @param {Object} query REST query params from the request
 * @return {Promise}
 */
function listWebapps (query) {
  logger.debug(`[listWebapps]`)

  return Promise.try(() => {
    const sql = _buildSqlListWebapp(query)

    return db.getInstance().query(sql.dbQuery, sql.dbParams)
  })

    .catch(err => {
      const payload = {
        info: {
          origin: 'Models - webapp.js - listWebapps() - catch'
        }
      }

      const verror = error4express.generateVError(err, payload)
      logger.error(verror)

      return Promise.reject(verror)
    })
}

/**
 * Build the SQL request for all the webapp
 *
 * @param {Object} query REST query params from the request
 * @return {Object}
 */
function _buildSqlListWebapp (query) {
  let dbQuery = `SELECT * FROM webapp WHERE deleted = false`
  let dbParams = []

  if (query.slug) {
    dbQuery += ' AND slug = $1'
    dbParams = [query.slug]
  } else if (query.webapp_ids) {
    dbQuery += ' AND id = ANY($1::int[])'
    // transform the comma separated string provided in params into an array (ex: '1,2,3' to [1,2,3])
    dbParams = [query.webapp_ids.split(',').map(Number)]
  }

  return { dbQuery, dbParams }
}

/**
 * Get one webapp by id from the Postgres database
 *
 * @param {Number} id of the webapp
 * @return {Promise}
 */
function getWebappById (id) {
  logger.debug(`[getWebappById]`)

  const dbQuery = `SELECT * FROM webapp WHERE id = $1 AND deleted = false;`

  return Promise.try(() => db.getInstance().query(dbQuery, [id]))

    .then(res => {
      let returnPromise
      logger.info(`[getWebappById - success - res: ${JSON.stringify(res)}]`)

      if (_.isEmpty(res.rows)) {
        const message = `Webapp ${id} not found`
        const err = new Error(message)
        const payload = {
          info: {
            statusCode: 404,
            message,
            origin: 'Models - webapp.js - getWebappById(id) - then'
          }
        }

        const verror = error4express.generateVError(err, payload)

        returnPromise = Promise.reject(verror)
      } else {
        returnPromise = Promise.resolve(res.rows[0])
      }

      return returnPromise
    })

    .catch(err => {
      const payload = {
        info: {
          origin: 'Models - webapp.js - getWebappById(id) - catch'
        }
      }

      const verror = error4express.generateVError(err, payload)
      logger.error(verror)

      return Promise.reject(verror)
    })
}

/**
 * Delete a webapp by name from the Postgres database
 *
 * @param {Number} id of the webapp
 * @return {Promise}
 */
function deleteWebapp (id) {
  logger.debug(`[deleteWebapp]`)
  const dbQuery = `UPDATE webapp SET deleted = true, slug = slug || '_' || $1 WHERE id=$1 AND deleted=false RETURNING *;`

  return Promise.try(() => db.getInstance().query(dbQuery, [id]))

    .then(res => {
      logger.info(`[deleteWebapp - success - res: ${JSON.stringify(res)}]`)

      let returnPromise
      if (_.isEmpty(res.rows)) {
        const message = `Webapp ${id} does not exist`
        const err = new Error(message)
        const payload = {
          info: {
            statusCode: 404,
            message,
            origin: 'Models - webapp.js - deleteWebapp(id) - then'
          }
        }

        const verror = error4express.generateVError(err, payload)

        returnPromise = Promise.reject(verror)
      } else {
        // When we delete the webapp we are actually soft deleting it
        // we get this new id but the old webapp stay with the same id in the cache
        // that's why we need to delete the cache with the old id by using the replace
        const webappDeleted = res.rows.shift()
        const pattern = `${webappDeleted.slug.replace(`_${id}`, '')}:*`
        returnPromise = Promise.resolve(200)
        returnPromise.tap(() => _handleCleanCacheByPattern(pattern))
      }

      return returnPromise
    })
    .catch(err => {
      const payload = {
        info: {
          origin: 'Models - webapp.js - deleteWebapp(name) - catch'
        }
      }

      const verror = error4express.generateVError(err, payload)
      logger.error(verror)

      return Promise.reject(verror)
    })
}

/**
 * Handle the cleaning of the cache using a pattern
 *
 * @param {String} pattern pattern to find redis key to delete
 * @param {Mixed} returnValue value to return, default 200
 * @return {Promise}
 */
function _handleCleanCacheByPattern (pattern) {
  logger.debug(`[cache invalidation - searching for keys with pattern: ${pattern}`)

  return common.deleteCacheByPattern(cacheManager.getInstance(), pattern)

    .catch(e => {
      logger.error('[ERROR] Cache system error. ', e)

      return Promise.resolve(200)
    })
}

/**
 * Create a webapp from the webapp object provided
 *
 * @param {Object} webapp which is already encoded from the controller
 * @returns {Promise}
 */
function createWebapp (webapp) {
  logger.debug(`[createWebapp - params : webapp: ${JSON.stringify(webapp)}]`)

  const dbQuery = `INSERT INTO webapp (slug, name, description, repository, gitlab_project_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;`
  const dbQueryValues = [
    webapp.slug,
    webapp.name,
    webapp.description,
    webapp.repository,
    webapp.gitlab_project_id
  ]

  return Promise.try(() => db.getInstance().query(dbQuery, dbQueryValues))

    .then(res => {
      logger.info(`[createWebapp - success - res: ${JSON.stringify(res)}]`)

      return Promise.resolve(res.rows.shift())
    })
    .catch(err => {
      let verror
      let payload

      // Check postgres code indicating a violation of unique constraint that caused a unique_violation error
      if (err.code === '23505') {
        const message = `Webapp ${webapp.slug} already exists.
        Please choose a different slug of this webapp.`
        payload = {
          info: {
            statusCode: 422,
            message,
            origin: 'Models - webapp.js - createWebapp - catch'
          }
        }
      } else {
        payload = {
          info: {
            origin: 'Models - webapp.js - createWebapp - catch',
            postgres: {
              errCode: err.code
            }
          }
        }
      }

      verror = error4express.generateVError(err, payload)
      logger.error(verror)

      return Promise.reject(verror)
    })
}

/**
 * This function is used to update a given webapp in the db
 *
 * @param  {Object} webapp
 * @returns {Promise}
 */
function updateWebapp (webapp) {
  logger.debug(`[updateWebapp - params : webapp: ${JSON.stringify(webapp)}]`)

  const dbQuery = `UPDATE webapp SET slug=$1, name=$2, description=$3, repository=$4, gitlab_project_id=$6 WHERE id=$5 AND deleted=false RETURNING *;`
  const dbQueryValues = [
    webapp.slug,
    webapp.name,
    webapp.description,
    webapp.repository,
    webapp.id,
    webapp.gitlab_project_id
  ]

  return Promise.try(() => getWebappById(webapp.id)

    .then(oldWebApp => {
      return db.getInstance().query(dbQuery, dbQueryValues)

        .then(res => {
          let returnPromise
          logger.info(`[updateWebapp - success - res: ${JSON.stringify(res)}]`)

          if (_.isEmpty(res.rows)) {
            const message = `Webapp ${webapp.id} not found`
            const err = new Error(message)
            const payload = {
              info: {
                statusCode: 404,
                message,
                origin: 'Models - webapp.js - updateWebapp(id) - then'
              }
            }

            const verror = error4express.generateVError(err, payload)

            returnPromise = Promise.reject(verror)
          } else {
            const webappUpdated = res.rows[0]
            const pattern = `${oldWebApp.slug}:*`

            returnPromise = Promise.resolve(webappUpdated)
            returnPromise.tap(() => _handleCleanCacheByPattern(pattern))
          }

          return returnPromise
        })
    })

    .catch(err => {
      let verror
      let payload

      // Check postgres code indicating a violation of unique constraint that caused a unique_violation error
      if (err.code === '23505') {
        const message = `Webapp ${webapp.slug} already exists.
        Please choose a different slug of this webapp.`
        payload = {
          info: {
            statusCode: 422,
            message,
            origin: 'Models - webapp.js - createWebapp - catch'
          }
        }
      } else {
        payload = {
          info: {
            origin: 'Models - webapp.js - createWebapp - catch',
            postgres: {
              errCode: err.code
            }
          }
        }
      }

      verror = error4express.generateVError(err, payload)

      return Promise.reject(verror)
    }))
}

module.exports = {
  getWebappById,
  listWebapps,
  deleteWebapp,
  createWebapp,
  updateWebapp
}
