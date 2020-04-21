'use strict'

const path = require('path')
const mockery = require('mockery')
const httpMocks = require('node-mocks-http')

require(path.resolve('test/chai'))
const common = require(path.resolve('src/modules/common'))
const bootstrap = require(path.resolve('test/bootstrap'))

describe('Unit test - Controller - Photo', () => {
  describe('POST photo', () => {
    let mockPhotoModel = null

    beforeEach(() => bootstrap.tearUp())
    afterEach(() => bootstrap.tearDown())

    function initMocks () {
      mockPhotoModel = {
        createPhoto: sinon.stub().resolves(),
        getPhoto: sinon.stub().resolves(),
        deletePhoto: sinon.stub().resolves(),
        listPhotos: sinon.stub().resolves(),
        countPhoto: sinon.stub().resolves([])
      }

      mockery.registerMock(path.resolve('src/models/photo'), mockPhotoModel)
    }

    describe('postPhoto', () => {
      it('On success : should return 201', async () => {
        initMocks()

        const photoController = require(path.resolve('src/controllers/photo'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await photoController.postPhoto(req, res)

        expect(res.statusCode).to.equal(201)
      })

      it('On error : should return 500', async () => {
        initMocks()

        mockPhotoModel.createPhoto = sinon.stub().rejects(common.buildError())

        const photoController = require(path.resolve('src/controllers/photo'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await photoController.postPhoto(req, res)

        expect(res.statusCode).to.equal(500)
      })
    })

    describe('GET photo', () => {
      it('On success : should return 200', async () => {
        initMocks()

        const photoController = require(path.resolve('src/controllers/photo'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await photoController.getPhoto(req, res)

        expect(res.statusCode).to.equal(200)
      })

      it('On error : should return 500', async () => {
        initMocks()

        mockPhotoModel.getPhoto = sinon.stub().rejects(common.buildError())

        const photoController = require(path.resolve('src/controllers/photo'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await photoController.getPhoto(req, res)

        expect(res.statusCode).to.equal(500)
      })
    })

    describe('GET list photo', () => {
      it('On success : should return 200', async () => {
        initMocks()

        const photoController = require(path.resolve('src/controllers/photo'))
        const req = httpMocks.createRequest({ query: {} })
        const res = httpMocks.createResponse()

        await photoController.listPhotos(req, res)

        expect(res.statusCode).to.equal(200)
      })

      it('On success : count photo should return 200', async () => {
        initMocks()

        const photoController = require(path.resolve('src/controllers/photo'))
        const req = httpMocks.createRequest({ body: {}, query: { 'count': 1 } })
        const res = httpMocks.createResponse()

        await photoController.listPhotos(req, res)

        expect(res.statusCode).to.equal(200)
      })

      it('On error : should return 500', async () => {
        initMocks()

        mockPhotoModel.listPhotos = sinon.stub().rejects(common.buildError())

        const photoController = require(path.resolve('src/controllers/photo'))
        const req = httpMocks.createRequest({ query: {} })
        const res = httpMocks.createResponse()

        await photoController.listPhotos(req, res)

        expect(res.statusCode).to.equal(500)
      })
    })

    describe('GET count photo', () => {
      it('On success : should return 200', async () => {
        initMocks()

        const photoController = require(path.resolve('src/controllers/photo'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await photoController.countPhoto(req, res)

        expect(res.statusCode).to.equal(200)
      })

      it('On error : should return 500', async () => {
        initMocks()

        mockPhotoModel.countPhoto = sinon.stub().rejects(common.buildError())

        const photoController = require(path.resolve('src/controllers/photo'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await photoController.countPhoto(req, res)

        expect(res.statusCode).to.equal(500)
      })
    })

    describe('DELETE photo', () => {
      it('On success : should return 204', async () => {
        initMocks()

        const photoController = require(path.resolve('src/controllers/photo'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await photoController.deletePhoto(req, res)

        expect(res.statusCode).to.equal(204)
      })

      it('On error : should return 500', async () => {
        initMocks()

        mockPhotoModel.deletePhoto = sinon.stub().rejects(common.buildError())

        const photoController = require(path.resolve('src/controllers/photo'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await photoController.deletePhoto(req, res)

        expect(res.statusCode).to.equal(500)
      })
    })
  })
})
