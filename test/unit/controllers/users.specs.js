'use strict'

const path = require('path')
const mockery = require('mockery')
const httpMocks = require('node-mocks-http')

require(path.resolve('test/chai'))
const common = require(path.resolve('src/modules/common'))
const bootstrap = require(path.resolve('test/bootstrap'))

describe.only('Unit test - User', () => {
  describe('POST user', () => {
    let mockUserModel = null

    beforeEach(() => bootstrap.tearUp())
    afterEach(() => bootstrap.tearDown())

    function initMocks () {
      mockUserModel = {
        createUser: sinon.stub().resolves()
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
    })

    describe('GET list user', () => {
    })

    describe('GET count user', () => {
    })

    describe('DELETE user', () => {
    })
  })
})
