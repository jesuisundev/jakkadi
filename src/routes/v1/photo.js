'use strict'

const Joi = require('joi')
const path = require('path')
const controllersPath = '../../controllers/'

module.exports = [
  {
    method: 'get',
    url: '/photo/',
    handler: require(path.join(controllersPath, 'photo')).listPhotos,
    validate: {
      query: {
        count: Joi.number().description('Boolean to get count of photos').example('1')
      }
    },
    description: 'Get the list of photos. Note that if there are no photos, an empty array will be returned.',
    tags: ['photo']
  },
  {
    method: 'get',
    url: '/photo/:id_photo',
    description: 'Get a photo',
    handler: require(path.join(controllersPath, 'photo')).getPhoto,
    validate: {
      params: {
        id_photo: Joi.number().required().description('Specify the id of the photo').example('1')
      }
    },
    tags: ['photo']
  },
  {
    method: 'post',
    url: '/photo/',
    handler: require(path.join(controllersPath, 'photo')).postPhoto,
    description: 'Create a photo',
    validate: {
      body: {
        // TODO - ADD FILE TO UPLOAD
        id_user: Joi.number().required().description('Specify the id of the user linked to this photo').example('1'),
        id_challenge: Joi.number().required().description('Specify the id of the user linked to this photo').example('1'),
        description: Joi.string().required().description('Specify the description of the photo').example('supertoto')
      }
    },
    tags: ['photo']
  },
  {
    method: 'delete',
    url: '/photo/:id_photo',
    handler: require(path.join(controllersPath, 'photo')).deletePhoto,
    description: 'Delete a photo',
    validate: {
      params: {
        id_photo: Joi.number().required().description('Specify the id of the photo').example('1')
      }
    },
    tags: ['photo']
  }
]
