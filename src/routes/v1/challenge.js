'use strict'

const Joi = require('joi')
const path = require('path')
const controllersPath = '../../controllers/'

const nameChallengeRegex = /^[a-zA-Z0-9-_ *]{3,25}$/

module.exports = [
  {
    method: 'get',
    url: '/challenge/',
    handler: require(path.join(controllersPath, 'challenge')).listChallenge,
    validate: {
      query: {
        count: Joi.number().description('Boolean to get count of challenge').example('1')
      }
    },
    description: 'Get the list of challenges. Note that if there are no challange, an empty array will be returned.',
    tags: ['challenge']
  },
  {
    method: 'get',
    url: '/challenge/:id_challenge',
    description: 'Get a challenge',
    handler: require(path.join(controllersPath, 'challenge')).getChallenge,
    validate: {
      params: {
        id_user: Joi.number().required().description('Specify the id of the challenge').example('1')
      }
    },
    tags: ['challenge']
  },
  {
    method: 'post',
    url: '/challenge/',
    handler: require(path.join(controllersPath, 'challenge')).postChallenge,
    description: 'Create a challenge',
    validate: {
      body: {
        name: Joi.string().regex(nameChallengeRegex).required().description('Specify the name of the challenge').example('supertoto'),
        description: Joi.string().required().description('Specify the description of the challenge').example('supertoto'),
        date_start: Joi.date().iso().required().description('Specify the beginning date').example('2020-04-16T09:51:22.020'),
        date_end: Joi.date().iso().greater(Joi.ref('date_start')).required().description('Specify the end date').example('2020-04-18T09:51:22.020')
      }
    },
    tags: ['challenge']
  },
  {
    method: 'delete',
    url: '/challenge/:id_challenge',
    handler: require(path.join(controllersPath, 'challenge')).deleteChallenge,
    description: 'Delete a challenge',
    validate: {
      params: {
        id_user: Joi.number().required().description('Specify the id of the challenge').example('1')
      }
    },
    tags: ['challenge']
  }
]
