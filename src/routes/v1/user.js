'use strict'

const Joi = require('joi')
const path = require('path')
const controllersPath = '../../controllers/'

module.exports = [
  {
    method: 'get',
    url: '/user/',
    handler: require(path.join(controllersPath, 'user')).listUsers,
    description: 'Get the list of users. Note that if there are no users, an empty array will be returned.',
    tags: ['user']
  },
  {
    method: 'get',
    url: '/user/:user_id',
    description: 'Get a user',
    handler: require(path.join(controllersPath, 'user')).getUser,
    validate: {
      params: {
        user_id: Joi.number().required().description('Specify the id of the user').example('1')
      }
    },
    tags: ['user']
  },
  {
    method: 'post',
    url: '/user/',
    handler: require(path.join(controllersPath, 'user')).postUser,
    description: 'Create a user',
    validate: {
      body: {}
    },
    tags: ['user']
  },
  {
    method: 'delete',
    url: '/user/:user_id',
    handler: require(path.join(controllersPath, 'user')).deleteUser,
    description: 'Delete a user',
    validate: {
      params: {
        user_id: Joi.number().required().description('Specify the id of the user').example('1')
      }
    },
    tags: ['user']
  }
]
