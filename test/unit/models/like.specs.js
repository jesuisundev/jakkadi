'use strict'

const path = require('path')
const mockery = require('mockery')
const httpMocks = require('node-mocks-http')

require(path.resolve('test/chai'))
const common = require(path.resolve('src/modules/common'))
const bootstrap = require(path.resolve('test/bootstrap'))

describe('Unit test - Model - Like', () => {
  describe('POST like', () => {
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

    describe('postLike', () => {
      it('On success : should return 201', async () => {
        queryStub = sinon.stub().resolves({ rows: {} })
        initMocks(queryStub)

        const likeModel = require(path.resolve('src/models/like'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        const rows = await likeModel.createLike(req, res)

        expect(rows).to.deep.equal({})
      })

      it('On error : if already exist should return 409', async () => {
        queryStub = sinon.stub().rejects({ code: '23505' })
        initMocks(queryStub)

        const likeModel = require(path.resolve('src/models/like'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await likeModel.createLike(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(409)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })

      it('On error : should return 500', async () => {
        queryStub = sinon.stub().rejects(common.buildError())
        initMocks(queryStub)

        const likeModel = require(path.resolve('src/models/like'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await likeModel.createLike(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(500)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })
    })

    describe('GET like', () => {
      it('On success : should return 200', async () => {
        queryStub = sinon.stub().resolves({ rows: [{ likename: 'superToto' }] })
        initMocks(queryStub)

        const likeModel = require(path.resolve('src/models/like'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        const like = await likeModel.getLike(req, res)

        expect(like.likename).to.equal('superToto')
      })

      it('On error : if no like should return 404', async () => {
        queryStub = sinon.stub().resolves({ rows: [] })
        initMocks(queryStub)

        const likeModel = require(path.resolve('src/models/like'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await likeModel.getLike(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(404)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })

      it('On error : should return 500', async () => {
        queryStub = sinon.stub().rejects()
        initMocks(queryStub)

        const likeModel = require(path.resolve('src/models/like'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await likeModel.getLike(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(500)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })
    })

    describe('GET count like', () => {
      it('On success : should return 200', async () => {
        queryStub = sinon.stub().resolves({ rows: [] })
        initMocks(queryStub)

        const likeModel = require(path.resolve('src/models/like'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        const likes = await likeModel.countLike(req, res)

        expect(likes).to.deep.equal([])
      })

      it('On error : should return 500', async () => {
        queryStub = sinon.stub().rejects()
        initMocks(queryStub)

        const likeModel = require(path.resolve('src/models/like'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await likeModel.countLike(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(500)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })
    })

    describe('DELETE like', () => {
      it('On success : should return 204', async () => {
        queryStub = sinon.stub().resolves({ rowCount: 1 })
        initMocks(queryStub)

        const likeModel = require(path.resolve('src/models/like'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        const rows = await likeModel.deleteLike(req, res)

        expect(rows).to.deep.equal({})
      })

      it('On error : if like not exist should return 404', async () => {
        queryStub = sinon.stub().resolves({ rowCount: 0 })
        initMocks(queryStub)

        const likeModel = require(path.resolve('src/models/like'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await likeModel.deleteLike(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(404)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })

      it('On error : should return 500', async () => {
        queryStub = sinon.stub().rejects(common.buildError())
        initMocks(queryStub)

        const likeModel = require(path.resolve('src/models/like'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await likeModel.deleteLike(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(500)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })
    })
  })
})
