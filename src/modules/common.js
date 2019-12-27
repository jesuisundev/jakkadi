'use strict'

const path = require('path')
const ConfigResolver = require('gap-configuration-resolver')
const config = ConfigResolver.resolve(path.resolve('config/config.json'))
const logger = require('logger4express').generate(config, module.filename)
const Joi = require('joi')

/**
 * Recursive Scan (redis search) key with pattern
 * @param {object} instance instance of the redis client
 * @param {integer} cursor current cursor of the scan
 * @param {string} pattern pattern of the search
 * @param {array} cumulKeys cumul of the keys matching
 *
 * @return Promise
 */
function recursiveCacheScan (instance, cursor, pattern, cumulKeys) {
  cumulKeys = cumulKeys || []

  return instance.scanAsync(cursor, 'MATCH', pattern, 'COUNT', '10')

    .then(res => {
      // Update the cursor position for the next scan
      cursor = res[0]
      // add the result for this iteration on the base array
      cumulKeys = cumulKeys.concat(res[1])

      // If the cursor hit 0 it means the scan is over
      if (cursor === '0') {
        return cumulKeys
      } else {
        return recursiveCacheScan(instance, cursor, pattern, cumulKeys)
      }
    })
}

/**
 * Delete every key corresponding to the pattern
 * Do nothing if no keys are found after the scan
 * Use a recursive redis scan to get the involved keys
 * Thens use multi for delete to handle any numbers of keys to delete
 * see https://github.com/NodeRedis/node_redis#clientmulticommands
 * @param {object} instance instance of the redis client
 * @param {string} pattern pattern of the search
 *
 * @return Promise
 */
function deleteCacheByPattern (instance, pattern) {
  return recursiveCacheScan(instance, 0, pattern)

    .then(keys => {
      let returnPromise = Promise.resolve(200)

      if (keys.length) {
        let multiRedisDel = []

        keys.forEach(key => {
          logger.debug(`[cache invalidation - key FOUND deleting cache with key: ${key}]`)

          multiRedisDel.push(['del', key])
        })

        returnPromise = instance.multi(multiRedisDel)
          .execAsync()
      }

      return returnPromise
    })
}

/**
 * Build LIMIT and OFFSET sql statement for postgressql query
 * will build the text query and the corresponding array of data
 *
 * Example :
 *
 * input
 * { limit: 10, offset: 5, orderby: 'name' }
 *
 * output
 * {
 *   query: 'LIMIT $1 OFFSET $2',
 *   params: [10, 5]
 * }
 * @param {integer} limit number of limit needed in PG query
 * @param {integer} offset number of offset needed in PG query
 * @param {integer} index current index in PG query, default 0
 *
 * @return Object
 */
function buildSQLFilter (limit, offset, index = 0) {
  let params = []
  let query = ''

  if (Number.isInteger(limit) && limit > -1) {
    index++
    query = ` LIMIT $${index}`
    params.push(limit)
  }

  if (Number.isInteger(offset) && offset > -1) {
    index++
    query = `${query} OFFSET $${index}`
    params.push(offset)
  }

  return { query, params }
}

/**
 * Build ORDER BY SQL statement for postgressql query
 * PostgreSQL does not handle parameters with ORDER BY so
 * we have to append the column name manually
 * Therefore we need to double check with Joi that the column
 * name is what we want to avoid injection
 *
 * Example :
 *
 * input
 * 'name.desc'
 *
 * output
 * ' ORDER BY name DESC'
 *
 * input
 * 'name'
 *
 * output
 * ' ORDER BY name ASC'
 *
 * input
 * ''
 *
 * output
 * ''
 * @param {string} orderBy string of order by needed in PG query
 *
 * @return String
 */
function buildSQLOrderBy (orderBy) {
  let queryOrderBy = ''

  if (orderBy) {
    const isValid = Joi.validate(
      orderBy,
      Joi.string().valid(...config.build.orderby)
    )

    if (!isValid.error) {
      const order = orderBy.split('.')
      const sort = order[1] ? order[1].toUpperCase() : 'ASC'
      queryOrderBy = ` ORDER BY ${order[0]} ${sort}`
    } else {
      throw new Error(isValid.error)
    }
  }

  return queryOrderBy
}

module.exports = {
  recursiveCacheScan,
  deleteCacheByPattern,
  buildSQLFilter,
  buildSQLOrderBy
}
