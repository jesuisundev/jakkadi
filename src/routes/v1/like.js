'use strict'

const Joi = require('joi')
const path = require('path')
const controllersPath = '../../controllers/'

module.exports = [
  {
    method: 'get',
    url: '/like/:id_like',
    description: 'Get a like',
    handler: require(path.join(controllersPath, 'like')).getLike,
    validate: {
      params: {
        id_like: Joi.number().required().description('Specify the id of the like').example('1')
      }
    },
    tags: ['like']
  },
  {
    method: 'post',
    url: '/like/',
    handler: require(path.join(controllersPath, 'like')).postLike,
    description: 'Create a like',
    validate: {
      body: {
        id_user: Joi.number().required().description('Specify the id of the user').example('1'),
        id_photo: Joi.number().required().description('Specify the id of the photo').example('1')
      }
    },
    tags: ['like']
  },
  {
    method: 'delete',
    url: '/like/:id_like',
    handler: require(path.join(controllersPath, 'like')).deleteLike,
    description: 'Delete a like',
    validate: {
      params: {
        id_like: Joi.number().required().description('Specify the id of the like').example('1')
      }
    },
    tags: ['like']
  }
]
