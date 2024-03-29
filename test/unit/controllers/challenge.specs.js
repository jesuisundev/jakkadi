'use strict'

const path = require('path')
const mockery = require('mockery')
const httpMocks = require('node-mocks-http')

require(path.resolve('test/chai'))
const common = require(path.resolve('src/modules/common'))
const bootstrap = require(path.resolve('test/bootstrap'))

describe('Unit test - Controller - Challenge', () => {
  describe('POST challenge', () => {
    let mockChallengeModel = null
    let mockCommonModules = null

    beforeEach(() => bootstrap.tearUp())
    afterEach(() => bootstrap.tearDown())

    function initMocks () {
      mockChallengeModel = {
        createChallenge: sinon.stub().resolves(),
        getChallenge: sinon.stub().resolves(),
        deleteChallenge: sinon.stub().resolves(),
        listChallenges: sinon.stub().resolves(),
        getCurrentChallenge: sinon.stub().resolves(),
        countChallenge: sinon.stub().resolves([]),
        getPhotosByChallenge: sinon.stub().resolves([])
      }

      mockCommonModules = {
        getAsyncCache: sinon.stub().resolves(),
        setAsyncCache: sinon.stub().resolves(),
        delAsyncCache: sinon.stub().resolves()
      }

      mockery.registerMock(path.resolve('src/models/challenge'), mockChallengeModel)
      mockery.registerMock(path.resolve('src/modules/common'), mockCommonModules)
    }

    describe('postChallenge', () => {
      it('On success : should return 201', async () => {
        initMocks()

        const challengeController = require(path.resolve('src/controllers/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await challengeController.postChallenge(req, res)

        expect(res.statusCode).to.equal(201)
      })

      it('On error : should return 500', async () => {
        initMocks()

        mockChallengeModel.createChallenge = sinon.stub().rejects(common.buildError())

        const challengeController = require(path.resolve('src/controllers/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await challengeController.postChallenge(req, res)

        expect(res.statusCode).to.equal(500)
      })
    })

    describe('GET challenge', () => {
      it('On success : should return 200', async () => {
        initMocks()

        const challengeController = require(path.resolve('src/controllers/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await challengeController.getChallenge(req, res)

        expect(res.statusCode).to.equal(200)
      })

      it('On error : should return 500', async () => {
        initMocks()

        mockChallengeModel.getChallenge = sinon.stub().rejects(common.buildError())

        const challengeController = require(path.resolve('src/controllers/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await challengeController.getChallenge(req, res)

        expect(res.statusCode).to.equal(500)
      })
    })

    describe('GET challenge', () => {
      it('On success : should return 200', async () => {
        initMocks()

        const challengeController = require(path.resolve('src/controllers/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await challengeController.getCurrentChallenge(req, res)

        expect(res.statusCode).to.equal(200)
      })

      it('On success : should return 200 if cache is present', async () => {
        initMocks()

        const challengeController = require(path.resolve('src/controllers/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()
        mockCommonModules.getAsyncCache = sinon.stub().resolves({})

        await challengeController.getCurrentChallenge(req, res)

        expect(res.statusCode).to.equal(200)
      })

      it('On error : should return 500', async () => {
        initMocks()

        mockChallengeModel.getCurrentChallenge = sinon.stub().rejects(common.buildError())

        const challengeController = require(path.resolve('src/controllers/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await challengeController.getCurrentChallenge(req, res)

        expect(res.statusCode).to.equal(500)
      })
    })

    describe('GET list challenge', () => {
      it('On success : should return 200', async () => {
        initMocks()

        const challengeController = require(path.resolve('src/controllers/challenge'))
        const req = httpMocks.createRequest({ query: {} })
        const res = httpMocks.createResponse()

        await challengeController.listChallenges(req, res)

        expect(res.statusCode).to.equal(200)
      })

      it('On success : count challenge should return 200', async () => {
        initMocks()

        const challengeController = require(path.resolve('src/controllers/challenge'))
        const req = httpMocks.createRequest({ body: {}, query: { count: 1 } })
        const res = httpMocks.createResponse()

        await challengeController.listChallenges(req, res)

        expect(res.statusCode).to.equal(200)
      })

      it('On error : should return 500', async () => {
        initMocks()

        mockChallengeModel.listChallenges = sinon.stub().rejects(common.buildError())

        const challengeController = require(path.resolve('src/controllers/challenge'))
        const req = httpMocks.createRequest({ query: {} })
        const res = httpMocks.createResponse()

        await challengeController.listChallenges(req, res)

        expect(res.statusCode).to.equal(500)
      })
    })

    describe('GET count challenge', () => {
      it('On success : should return 200', async () => {
        initMocks()

        const challengeController = require(path.resolve('src/controllers/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await challengeController.countChallenge(req, res)

        expect(res.statusCode).to.equal(200)
      })

      it('On error : should return 500', async () => {
        initMocks()

        mockChallengeModel.countChallenge = sinon.stub().rejects(common.buildError())

        const challengeController = require(path.resolve('src/controllers/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await challengeController.countChallenge(req, res)

        expect(res.statusCode).to.equal(500)
      })
    })

    describe('DELETE challenge', () => {
      it('On success : should return 204', async () => {
        initMocks()

        const challengeController = require(path.resolve('src/controllers/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await challengeController.deleteChallenge(req, res)

        expect(res.statusCode).to.equal(204)
      })

      it('On error : should return 500', async () => {
        initMocks()

        mockChallengeModel.deleteChallenge = sinon.stub().rejects(common.buildError())

        const challengeController = require(path.resolve('src/controllers/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await challengeController.deleteChallenge(req, res)

        expect(res.statusCode).to.equal(500)
      })
    })

    describe('GET list photo by challenge', () => {
      it('On success : should return 200', async () => {
        initMocks()

        const challengeController = require(path.resolve('src/controllers/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await challengeController.getPhotosByChallenge(req, res)

        expect(res.statusCode).to.equal(200)
      })

      it('On success : should return 200 if cache is present', async () => {
        initMocks()

        const challengeController = require(path.resolve('src/controllers/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()
        mockCommonModules.getAsyncCache = sinon.stub().resolves({})

        await challengeController.getPhotosByChallenge(req, res)

        expect(res.statusCode).to.equal(200)
      })

      it('On error : should return 500', async () => {
        initMocks()

        mockChallengeModel.getPhotosByChallenge = sinon.stub().rejects(common.buildError())

        const challengeController = require(path.resolve('src/controllers/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await challengeController.getPhotosByChallenge(req, res)

        expect(res.statusCode).to.equal(500)
      })
    })
  })
})
