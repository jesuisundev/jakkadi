'use strict'

const Joi = require('joi')
const path = require('path')
const controllersPath = '../../controllers/'

const usernameRegex = /^[a-zA-Z0-9-_*]{3,25}$/

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
    url: '/user/:id_user',
    description: 'Get a user',
    handler: require(path.join(controllersPath, 'user')).getUser,
    validate: {
      params: {
        id_user: Joi.number().required().description('Specify the id of the user').example('1')
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
      body: {
        username: Joi.string().regex(usernameRegex).required().description('Specify the username of the user').example('supertoto'),
        email: Joi.string().email().required().description('Specify the email of the user').example('supertoto@free.com'),
        password: Joi.string().required().description('Specify the password of the user').example('supertoto')
      }
    },
    tags: ['user']
  },
  {
    method: 'delete',
    url: '/user/:id_user',
    handler: require(path.join(controllersPath, 'user')).deleteUser,
    description: 'Delete a user',
    validate: {
      params: {
        id_user: Joi.number().required().description('Specify the id of the user').example('1')
      }
    },
    tags: ['user']
  }
]
