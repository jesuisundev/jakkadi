'use strict'

const path = require('path')
const mockery = require('mockery')
const httpMocks = require('node-mocks-http')

require(path.resolve('test/chai'))
const common = require(path.resolve('src/modules/common'))
const bootstrap = require(path.resolve('test/bootstrap'))

describe('Unit test - Controller - Like', () => {
  describe('POST like', () => {
    let mockLikeModel = null
    let mockCommonModules = null

    beforeEach(() => bootstrap.tearUp())
    afterEach(() => bootstrap.tearDown())

    function initMocks () {
      mockLikeModel = {
        createLike: sinon.stub().resolves(),
        getLike: sinon.stub().resolves(),
        getLikesByPhoto: sinon.stub().resolves(),
        deleteLike: sinon.stub().resolves(),
        countLike: sinon.stub().resolves([])
      }

      mockCommonModules = {
        getAsyncCache: sinon.stub().resolves(),
        setAsyncCache: sinon.stub().resolves(),
        delAsyncCache: sinon.stub().resolves()
      }

      mockery.registerMock(path.resolve('src/models/like'), mockLikeModel)
      mockery.registerMock(path.resolve('src/modules/common'), mockCommonModules)
    }

    describe('postLike', () => {
      it('On success : should return 201', async () => {
        initMocks()

        const likeController = require(path.resolve('src/controllers/like'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await likeController.postLike(req, res)

        expect(res.statusCode).to.equal(201)
      })

      it('On error : should return 500', async () => {
        initMocks()

        mockLikeModel.createLike = sinon.stub().rejects(common.buildError())

        const likeController = require(path.resolve('src/controllers/like'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await likeController.postLike(req, res)

        expect(res.statusCode).to.equal(500)
      })
    })

    describe('GET like', () => {
      it('On success : should return 200', async () => {
        initMocks()

        const likeController = require(path.resolve('src/controllers/like'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await likeController.getLike(req, res)

        expect(res.statusCode).to.equal(200)
      })

      it('On error : should return 500', async () => {
        initMocks()

        mockLikeModel.getLike = sinon.stub().rejects(common.buildError())

        const likeController = require(path.resolve('src/controllers/like'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await likeController.getLike(req, res)

        expect(res.statusCode).to.equal(500)
      })
    })

    describe('GET likes by photo', () => {
      it('On success : should return 200', async () => {
        initMocks()

        const likeController = require(path.resolve('src/controllers/like'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await likeController.getLikesByPhoto(req, res)

        expect(res.statusCode).to.equal(200)
      })

      it('On success : should return 200 if cache is present', async () => {
        initMocks()

        const likeController = require(path.resolve('src/controllers/like'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()
        mockCommonModules.getAsyncCache = sinon.stub().resolves({})

        await likeController.getLikesByPhoto(req, res)

        expect(res.statusCode).to.equal(200)
      })

      it('On error : should return 500', async () => {
        initMocks()

        mockLikeModel.getLikesByPhoto = sinon.stub().rejects(common.buildError())

        const likeController = require(path.resolve('src/controllers/like'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await likeController.getLikesByPhoto(req, res)

        expect(res.statusCode).to.equal(500)
      })
    })

    describe('GET count like', () => {
      it('On success : should return 200', async () => {
        initMocks()

        const likeController = require(path.resolve('src/controllers/like'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await likeController.countLike(req, res)

        expect(res.statusCode).to.equal(200)
      })

      it('On error : should return 500', async () => {
        initMocks()

        mockLikeModel.countLike = sinon.stub().rejects(common.buildError())

        const likeController = require(path.resolve('src/controllers/like'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await likeController.countLike(req, res)

        expect(res.statusCode).to.equal(500)
      })
    })

    describe('DELETE like', () => {
      it('On success : should return 204', async () => {
        initMocks()

        const likeController = require(path.resolve('src/controllers/like'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await likeController.deleteLike(req, res)

        expect(res.statusCode).to.equal(204)
      })

      it('On error : should return 500', async () => {
        initMocks()

        mockLikeModel.deleteLike = sinon.stub().rejects(common.buildError())

        const likeController = require(path.resolve('src/controllers/like'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await likeController.deleteLike(req, res)

        expect(res.statusCode).to.equal(500)
      })
    })
  })
})
