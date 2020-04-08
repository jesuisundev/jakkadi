'use strict'

const fs = require('fs')
const path = require('path')
const _ = require('lodash')

/**
 * Load all the route files and add the routes to the express app
 * @param  {String} routeDir - Routes directory
 * @param  {String} prefix - Routes path prefix
 * @return {Array} List of routes
 */
function loader (routeDir, prefix) {
  const routes = fs.readdirSync(routeDir)
    .filter((item) => fs.lstatSync(path.resolve(routeDir, item)).isDirectory())
    .reduce((acc, directory) => {
      return acc.concat(_readDirectory(path.resolve(routeDir, directory), directory, prefix))
    }, [])

  return routes
}

/**
 * Reads all route files within the directory/subdirectory
 * Imports each route file, makes a clone of it, and then
 * modifies the route.url of the clone accordingly.
 * This clone is returned so as to preserve the original route file
 * @param  {String} dirname     Directory name (ex: /path/to/application/routes)
 * @param  {String} basedirname Sub path within dirname folder (ex: 'v1')
 * @param  {String} prefix      Route prefix passed to loader (ex: '/api/config')
 * @return {Object[]}           Array of Route Objects, of the form:
  [
    {
      method: 'get',
      url: '/api/config/v1/configs/,
      description: 'Get a list of configs',
      handler: [Function: deleteConfig], //  the handling function to call
      tags: ['configs'],
      validate: {
        params: {...}
      },
      response: {
        status: {...}
      }
    },
    {...}
  ]
 */
function _readDirectory (dirname, basedirname, prefix) {
  prefix = prefix || ''

  return fs.readdirSync(dirname)
    .filter((item) => fs.lstatSync(path.resolve(dirname, item)).isFile())
    .reduce((acc, file) => {
      const filePath = path.resolve(dirname, file)
      const routes = _.cloneDeep(require(filePath))

      return acc.concat(routes.map((route) => {
        route.url = `/${prefix}/${/^_root$/.test(basedirname) ? '' : basedirname}/${route.url}/`
          .replace(/\/[/]*/g, '/')
          .replace(/\/$/, '')

        return route
      }))
    }, [])
}

module.exports = loader
