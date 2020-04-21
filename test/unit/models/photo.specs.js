'use strict'

const path = require('path')
const mockery = require('mockery')
const httpMocks = require('node-mocks-http')

require(path.resolve('test/chai'))
const common = require(path.resolve('src/modules/common'))
const bootstrap = require(path.resolve('test/bootstrap'))

describe('Unit test - Model - Photo', () => {
  describe('POST photo', () => {
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

    describe('postPhoto', () => {
      it('On success : should return 201', async () => {
        queryStub = sinon.stub().resolves({ rows: {} })
        initMocks(queryStub)

        const photoModel = require(path.resolve('src/models/photo'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        const rows = await photoModel.createPhoto(req, res)

        expect(rows).to.deep.equal({})
      })

      it('On error : if already exist should return 409', async () => {
        queryStub = sinon.stub().rejects({ code: '23505' })
        initMocks(queryStub)

        const photoModel = require(path.resolve('src/models/photo'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await photoModel.createPhoto(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(409)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })

      it('On error : if already exist should return 409 with different message', async () => {
        queryStub = sinon.stub().rejects({ code: '23505', constraint: 'photo_photoname_key' })
        initMocks(queryStub)

        const photoModel = require(path.resolve('src/models/photo'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await photoModel.createPhoto(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(409)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })

      it('On error : should return 500', async () => {
        queryStub = sinon.stub().rejects(common.buildError())
        initMocks(queryStub)

        const photoModel = require(path.resolve('src/models/photo'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await photoModel.createPhoto(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(500)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })
    })

    describe('GET photo', () => {
      it('On success : should return 200', async () => {
        queryStub = sinon.stub().resolves({ rows: [{ photoname: 'superToto' }] })
        initMocks(queryStub)

        const photoModel = require(path.resolve('src/models/photo'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        const photo = await photoModel.getPhoto(req, res)

        expect(photo.photoname).to.equal('superToto')
      })

      it('On error : if no photo should return 404', async () => {
        queryStub = sinon.stub().resolves({ rows: [] })
        initMocks(queryStub)

        const photoModel = require(path.resolve('src/models/photo'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await photoModel.getPhoto(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(404)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })

      it('On error : should return 500', async () => {
        queryStub = sinon.stub().rejects()
        initMocks(queryStub)

        const photoModel = require(path.resolve('src/models/photo'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await photoModel.getPhoto(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(500)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })
    })

    describe('GET list photo', () => {
      it('On success : should return 200', async () => {
        queryStub = sinon.stub().resolves({ rows: [] })
        initMocks(queryStub)

        const photoModel = require(path.resolve('src/models/photo'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        const photos = await photoModel.listPhotos(req, res)

        expect(photos).to.deep.equal([])
      })

      it('On error : should return 500', async () => {
        queryStub = sinon.stub().rejects()
        initMocks(queryStub)

        const photoModel = require(path.resolve('src/models/photo'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await photoModel.listPhotos(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(500)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })
    })

    describe('GET count photo', () => {
      it('On success : should return 200', async () => {
        queryStub = sinon.stub().resolves({ rows: [] })
        initMocks(queryStub)

        const photoModel = require(path.resolve('src/models/photo'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        const photos = await photoModel.countPhoto(req, res)

        expect(photos).to.deep.equal([])
      })

      it('On error : should return 500', async () => {
        queryStub = sinon.stub().rejects()
        initMocks(queryStub)

        const photoModel = require(path.resolve('src/models/photo'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await photoModel.countPhoto(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(500)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })
    })

    describe('DELETE photo', () => {
      it('On success : should return 204', async () => {
        queryStub = sinon.stub().resolves({ rowCount: 1 })
        initMocks(queryStub)

        const photoModel = require(path.resolve('src/models/photo'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        const rows = await photoModel.deletePhoto(req, res)

        expect(rows).to.deep.equal({})
      })

      it('On error : if photo not exist should return 404', async () => {
        queryStub = sinon.stub().resolves({ rowCount: 0 })
        initMocks(queryStub)

        const photoModel = require(path.resolve('src/models/photo'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await photoModel.deletePhoto(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(404)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })

      it('On error : should return 500', async () => {
        queryStub = sinon.stub().rejects(common.buildError())
        initMocks(queryStub)

        const photoModel = require(path.resolve('src/models/photo'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        try {
          await photoModel.deletePhoto(req, res)
        } catch (err) {
          expect(err.statusCode).to.equal(500)
          expect(db.getInstance().query.calledOnce).to.equal(true)
          expect(db.getInstance().query.calledTwice).to.equal(false)
        }
      })
    })
  })
})
