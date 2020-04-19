'use strict'

const path = require('path')
const mockery = require('mockery')
const httpMocks = require('node-mocks-http')

require(path.resolve('test/chai'))
const common = require(path.resolve('src/modules/common'))
const bootstrap = require(path.resolve('test/bootstrap'))

describe('Unit test - Model - Challenge', () => {
  describe('POST challenge', () => {
    let mockDb = null
    let db = null
    let queryStub = null

    beforeEach(() => bootstrap.tearUp())
    afterEach(() => bootstrap.tearDown())

    function initMocks (queryStub) {
      mockDb = {
        configure: sinon.stub(),
        getInstance: sinon.stub().returns({
          query: queryStub
        })
      }

      mockery.registerMock(path.resolve('src/modules/pg-manager'), mockDb)
      db = mockDb
    }

    describe('postChallenge', () => {
      it('On success : should return 201', async () => {
        queryStub = sinon.stub().resolves({ rows: {} })
        initMocks(queryStub)

        const challengeModel = require(path.resolve('src/models/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        const rows = await challengeModel.createChallenge(req, res)

        expect(rows).to.deep.equal({})
      })

      it('On error : should return 500', async () => {
        queryStub = sinon.stub().rejects(common.buildError())
        initMocks(queryStub)

        const challengeModel = require(path.resolve('src/models/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await challengeModel.createChallenge(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(500)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })
    })

    describe('GET challenge', () => {
      it('On success : should return 200', async () => {
        queryStub = sinon.stub().resolves({ rows: [{ challengename: 'superToto' }] })
        initMocks(queryStub)

        const challengeModel = require(path.resolve('src/models/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        const challenge = await challengeModel.getChallenge(req, res)

        expect(challenge.challengename).to.equal('superToto')
      })

      it('On error : if no challenge should return 404', async () => {
        queryStub = sinon.stub().resolves({ rows: [] })
        initMocks(queryStub)

        const challengeModel = require(path.resolve('src/models/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await challengeModel.getChallenge(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(404)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })

      it('On error : should return 500', async () => {
        queryStub = sinon.stub().rejects()
        initMocks(queryStub)

        const challengeModel = require(path.resolve('src/models/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await challengeModel.getChallenge(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(500)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })
    })

    describe('GET current challenge', () => {
      it('On success : should return 200', async () => {
        queryStub = sinon.stub().resolves({ rows: [{ challengename: 'superToto' }] })
        initMocks(queryStub)

        const challengeModel = require(path.resolve('src/models/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        const challenge = await challengeModel.getCurrentChallenge(req, res)

        expect(challenge.challengename).to.equal('superToto')
      })

      it('On error : if no challenge should return 404', async () => {
        queryStub = sinon.stub().resolves({ rows: [] })
        initMocks(queryStub)

        const challengeModel = require(path.resolve('src/models/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await challengeModel.getCurrentChallenge(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(404)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })

      it('On error : should return 500', async () => {
        queryStub = sinon.stub().rejects()
        initMocks(queryStub)

        const challengeModel = require(path.resolve('src/models/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await challengeModel.getCurrentChallenge(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(500)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })
    })

    describe('GET list challenge', () => {
      it('On success : should return 200', async () => {
        queryStub = sinon.stub().resolves({ rows: [] })
        initMocks(queryStub)

        const challengeModel = require(path.resolve('src/models/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        const challenges = await challengeModel.listChallenges(req, res)

        expect(challenges).to.deep.equal([])
      })

      it('On error : should return 500', async () => {
        queryStub = sinon.stub().rejects()
        initMocks(queryStub)

        const challengeModel = require(path.resolve('src/models/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await challengeModel.listChallenges(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(500)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })
    })

    describe('GET count challenge', () => {
      it('On success : should return 200', async () => {
        queryStub = sinon.stub().resolves({ rows: [] })
        initMocks(queryStub)

        const challengeModel = require(path.resolve('src/models/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        const challenges = await challengeModel.countChallenge(req, res)

        expect(challenges).to.deep.equal([])
      })

      it('On error : should return 500', async () => {
        queryStub = sinon.stub().rejects()
        initMocks(queryStub)

        const challengeModel = require(path.resolve('src/models/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await challengeModel.countChallenge(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(500)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })
    })

    describe('DELETE challenge', () => {
      it('On success : should return 204', async () => {
        queryStub = sinon.stub().resolves({ rowCount: 1 })
        initMocks(queryStub)

        const challengeModel = require(path.resolve('src/models/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        const rows = await challengeModel.deleteChallenge(req, res)

        expect(rows).to.deep.equal({})
      })

      it('On error : if challenge not exist should return 404', async () => {
        queryStub = sinon.stub().resolves({ rowCount: 0 })
        initMocks(queryStub)

        const challengeModel = require(path.resolve('src/models/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await challengeModel.deleteChallenge(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(404)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })

      it('On error : should return 500', async () => {
        queryStub = sinon.stub().rejects(common.buildError())
        initMocks(queryStub)

        const challengeModel = require(path.resolve('src/models/challenge'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await challengeModel.deleteChallenge(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(500)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })
    })
  })
})
