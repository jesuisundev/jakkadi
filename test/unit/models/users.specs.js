'use strict'

const path = require('path')
const mockery = require('mockery')
const httpMocks = require('node-mocks-http')

require(path.resolve('test/chai'))
const common = require(path.resolve('src/modules/common'))
const bootstrap = require(path.resolve('test/bootstrap'))

describe('Unit test - Model - User', () => {
  describe('POST user', () => {
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

    describe('postUser', () => {
      it('On success : should return 201', async () => {
        queryStub = sinon.stub().resolves({ rows: {} })
        initMocks(queryStub)

        const userModel = require(path.resolve('src/models/user'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        const rows = await userModel.createUser(req, res)

        expect(rows).to.deep.equal({})
      })

      it('On error : if already exist should return 409', async () => {
        queryStub = sinon.stub().rejects({ code: '23505' })
        initMocks(queryStub)

        const userModel = require(path.resolve('src/models/user'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await userModel.createUser(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(409)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })

      it('On error : should return 500', async () => {
        queryStub = sinon.stub().rejects(common.buildError())
        initMocks(queryStub)

        const userModel = require(path.resolve('src/models/user'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await userModel.createUser(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(500)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })
    })

    describe('GET user', () => {
      it('On success : should return 200', async () => {
        queryStub = sinon.stub().resolves({ rows: [{ username: 'superToto' }] })
        initMocks(queryStub)

        const userModel = require(path.resolve('src/models/user'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        const user = await userModel.getUser(req, res)

        expect(user.username).to.equal('superToto')
      })

      it('On error : if no user should return 404', async () => {
        queryStub = sinon.stub().resolves({ rows: [] })
        initMocks(queryStub)

        const userModel = require(path.resolve('src/models/user'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await userModel.getUser(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(404)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })

      it('On error : should return 500', async () => {
        queryStub = sinon.stub().rejects()
        initMocks(queryStub)

        const userModel = require(path.resolve('src/models/user'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await userModel.getUser(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(500)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })
    })

    describe('GET list user', () => {
    })

    describe('GET count user', () => {
    })

    describe('DELETE user', () => {
    })
  })
})
