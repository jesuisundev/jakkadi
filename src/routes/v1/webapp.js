'use strict'

const Joi = require('joi')
const path = require('path')
const _ = require('lodash')
const toRegexRange = require('to-regex-range')

const controllersPath = '../../controllers/'

const regex = require('../../helpers/regex')

// 1 and 2147483647 because the id is a serial numeric type (view psql docs)
const PSQL_MIN_SERIAL = 1
const PSQL_MAX_SERIAL = 2147483647

const rangeRegex = toRegexRange(PSQL_MIN_SERIAL, PSQL_MAX_SERIAL)
const webappIdsRegex = new RegExp(`^(${rangeRegex})(,(${rangeRegex}))*$`)

// Example for API documentation
const webappExample = {
  id: 12,
  slug: 'forhonor',
  name: 'For honor',
  description: 'Web app of For Honor',
  repository: 'gitlab-ncsa.ubisoft.org/forhonor/webapp/',
  deleted: false,
  gitlab_project_id: '123456',
  updated_at: '1533662831279'
}

const webappModel = {
  id: Joi.number().min(PSQL_MIN_SERIAL).max(PSQL_MAX_SERIAL).required(),
  slug: Joi.string().regex(regex.webappSlug).required(),
  name: Joi.string().regex(regex.webappName).required(),
  description: Joi.string().optional().allow(null),
  repository: Joi.string().optional().allow(null),
  gitlab_project_id: Joi.number().allow(null),
  deleted: Joi.boolean(),
  updated_at: Joi.date()
}

const webappFormat = Joi.object().keys(webappModel)
const webappFormatUpdateCreate = Joi.object().keys(_.omit(webappModel, ['id']))
const webappExampleUpdateCreate = _.omit(webappExample, ['id'])

const { authHeaders, jsonAuthHeaders } = require('../../helpers/authenticationHeaders')

module.exports = [
  {
    method: 'get',
    url: '/webapps/',
    handler: require(path.join(controllersPath, 'webapp')).listWebapps,
    description: 'Get the list of webapps. Note that if there are no webapps, an empty array will be returned.',
    validate: {
      headers: authHeaders,
      query: Joi.alternatives(
        [
          Joi.object().keys({ slug: Joi.string().regex(regex.webappSlug)
            .optional()
            .description('slug of the webapp')
            .example('example-slug')
          }),
          Joi.object().keys({
            webapp_ids: Joi.string().regex(webappIdsRegex)
              .optional()
              .description('List of comma separated ids to use for the search of webapps.')
              .example('1,2,3') })
        ])
        .description('Either an empty object, or an object containing slug OR webapp_ids, but not both.')
    },
    response: {
      status: {
        200: Joi.array().items(webappFormat)
          .description('A list of webapp objects')
          .example([webappExample]),
        400: Joi.object().keys({
          statusCode: Joi.number(),
          error: Joi.any(),
          message: Joi.string()
        }).description('Request format not valid'),
        422: Joi.object().keys({
          statusCode: Joi.number(),
          error: Joi.any(),
          message: Joi.string()
        }).description('Request has to search either for slug OR webapp ids.'),
        500: Joi.object().keys({
          statusCode: Joi.number(),
          error: Joi.any(),
          message: Joi.string()
        }).description('Unexpected server error')
      }
    },
    tags: ['webapps']
  },
  {
    method: 'get',
    url: '/webapps/:webapp_id',
    description: 'Get a webapp',
    handler: require(path.join(controllersPath, 'webapp')).getWebapp,
    validate: {
      headers: authHeaders,
      params: {
        webapp_id: Joi.number().required().description('Specify the id of the webapp').example('1')
      }
    },
    response: {
      status: {
        200: webappFormat.description('A webapp object').example(webappExample),
        400: Joi.object().keys({
          statusCode: Joi.number(),
          error: Joi.any(),
          message: Joi.string()
        }).description('Request format not valid'),
        404: Joi.object().keys({
          statusCode: Joi.number(),
          error: Joi.any(),
          message: Joi.string()
        }).description('Webapp does not exist'),
        500: Joi.object().keys({
          statusCode: Joi.number(),
          error: Joi.any(),
          message: Joi.string()
        }).description('Unexpected server error')
      }
    },
    tags: ['webapps']
  },
  {
    method: 'post',
    url: '/webapps/',
    handler: require(path.join(controllersPath, 'webapp')).createWebapp,
    description: 'Create a webapp',
    validate: {
      headers: Joi.object().keys({
        'content-type': 'application/json',
        cookie: Joi.string().required().description('Ntlm cookie')
      }).options({ allowUnknown: true }),
      body: webappFormatUpdateCreate.example(webappExampleUpdateCreate)
    },
    response: {
      status: {
        200: webappFormat.description('A webapp object').example(webappExample),
        400: Joi.object().keys({
          statusCode: Joi.number(),
          error: Joi.any(),
          message: Joi.string()
        }).description('Request format not valid'),
        500: Joi.object().keys({
          statusCode: Joi.number(),
          error: Joi.any(),
          message: Joi.string()
        }).description('Unexpected server error')
      }
    },
    tags: ['webapps']
  },
  {
    method: 'put',
    url: '/webapps/:webapp_id',
    handler: require(path.join(controllersPath, 'webapp')).updateWebapp,
    description: 'Update a webapp',
    validate: {
      params: {
        webapp_id: Joi.number().required().description('Specify the id of the webapp').example('1')
      },
      headers: jsonAuthHeaders,
      body: webappFormatUpdateCreate.example(webappExampleUpdateCreate)
    },
    response: {
      status: {
        200: webappFormat.description('A webapp object').example(webappExample),
        400: Joi.object(),
        500: Joi.object().keys({
          statusCode: Joi.number(),
          error: Joi.any(),
          message: Joi.string()
        }).description('Unexpected server error')
      }
    },
    tags: ['webapps']
  },
  {
    method: 'delete',
    url: '/webapps/:webapp_id',
    handler: require(path.join(controllersPath, 'webapp')).deleteWebapp,
    validate: {
      headers: authHeaders,
      params: {
        webapp_id: Joi.number().required().description('Specify the id of the webapp').example('Forhonor')
      }
    },
    response: {
      status: {
        200: Joi.string().example('The webapp Forhonor has been successfully deleted'),
        400: Joi.object().keys({
          statusCode: Joi.number(),
          error: Joi.any(),
          message: Joi.string()
        }).description('Request format not valid'),
        404: Joi.object().keys({
          statusCode: Joi.number(),
          error: Joi.any(),
          message: Joi.string()
        }).description('Webapp does not exist'),
        500: Joi.object().keys({
          statusCode: Joi.number(),
          error: Joi.any(),
          message: Joi.string()
        }).description('Unexpected server error')
      }
    },
    tags: ['webapps']
  }
]
