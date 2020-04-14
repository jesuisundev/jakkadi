'use strict'

const path = require('path')
const mockery = require('mockery')
const httpMocks = require('node-mocks-http')

require(path.resolve('test/chai'))
const common = require(path.resolve('src/modules/common'))
const bootstrap = require(path.resolve('test/bootstrap'))

describe('Unit test - Controller - User', () => {
  describe('POST user', () => {
    let mockUserModel = null

    beforeEach(() => bootstrap.tearUp())
    afterEach(() => bootstrap.tearDown())

    function initMocks () {
      mockUserModel = {
        createUser: sinon.stub().resolves(),
        getUser: sinon.stub().resolves(),
        deleteUser: sinon.stub().resolves(),
        listUsers: sinon.stub().resolves()
      }

      mockery.registerMock(path.resolve('src/models/user'), mockUserModel)
    }

    describe('postUser', () => {
      it('On success : should return 201', async () => {
        initMocks()

        const userController = require(path.resolve('src/controllers/user'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await userController.postUser(req, res)

        expect(res.statusCode).to.equal(201)
      })

      it('On error : should return 500', async () => {
        initMocks()

        mockUserModel.createUser = sinon.stub().rejects(common.buildError())

        const userController = require(path.resolve('src/controllers/user'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await userController.postUser(req, res)

        expect(res.statusCode).to.equal(500)
      })
    })

    describe('GET user', () => {
      it('On success : should return 200', async () => {
        initMocks()

        const userController = require(path.resolve('src/controllers/user'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await userController.getUser(req, res)

        expect(res.statusCode).to.equal(200)
      })

      it('On error : should return 500', async () => {
        initMocks()

        mockUserModel.getUser = sinon.stub().rejects(common.buildError())

        const userController = require(path.resolve('src/controllers/user'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await userController.getUser(req, res)

        expect(res.statusCode).to.equal(500)
      })
    })

    describe('GET list user', () => {
      it('On success : should return 200', async () => {
        initMocks()

        const userController = require(path.resolve('src/controllers/user'))
        const req = httpMocks.createRequest({ query: {} })
        const res = httpMocks.createResponse()

        await userController.listUsers(req, res)

        expect(res.statusCode).to.equal(200)
      })

      it('On error : should return 500', async () => {
        initMocks()

        mockUserModel.listUsers = sinon.stub().rejects(common.buildError())

        const userController = require(path.resolve('src/controllers/user'))
        const req = httpMocks.createRequest({ query: {} })
        const res = httpMocks.createResponse()

        await userController.listUsers(req, res)

        expect(res.statusCode).to.equal(500)
      })
    })

    describe('GET count user', () => {
    })

    describe('DELETE user', () => {
      it('On success : should return 204', async () => {
        initMocks()

        const userController = require(path.resolve('src/controllers/user'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await userController.deleteUser(req, res)

        expect(res.statusCode).to.equal(204)
      })

      it('On error : should return 500', async () => {
        initMocks()

        mockUserModel.deleteUser = sinon.stub().rejects(common.buildError())

        const userController = require(path.resolve('src/controllers/user'))
        const req = httpMocks.createRequest({ body: {} })
        const res = httpMocks.createResponse()

        await userController.deleteUser(req, res)

        expect(res.statusCode).to.equal(500)
      })
    })
  })
})
