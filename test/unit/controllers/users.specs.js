'use strict'

require('../../chai')

const path = require('path')
const mockery = require('mockery')
const VError = require('verror')
const rewire = require('rewire')

const bootstrap = require('../../bootstrap')

describe('Unit test - User', () => {
  describe('POST user', () => {
    const userController = rewire(path.resolve('src/controllers/user'))
    let mockUserModel = null

    beforeEach(() => bootstrap.tearUp())
    afterEach(() => bootstrap.tearDown())

    function initMocks () {
      mockUserModel = {
        createUser: sinon.stub().resolves()
      }

      mockery.registerMock('src/models/user', mockUserModel)
    }

    describe('postUser', () => {
      it('On success : should return 201', () => {
        initMocks()

        const req = { body: {} }
        const res = {}

        return userController.postUser(req, res)

          .then(res => {
            expect(res.statusCode).to.equal(201)
          })
      })
    })

    describe('GET user', () => {
      it('On success: should return a webapp object when payload is received from database', () => {
        initMocks(sinon.stub().resolves({ rows: [webapp] }))
        const id = 1

        return webappModel.getWebappById(id)

          .then(res => {
            expect(db.getInstance().query.calledWith('SELECT * FROM webapp WHERE id = $1 AND deleted = false;', [id]))
              .to.equal(true)
            expect(db.getInstance().query.calledOnce).to.equal(true)
            expect(db.getInstance().query.calledTwice).to.equal(false)
            expect(res).to.be.an('object')
              .that.has.all.keys(
                'id',
                'slug',
                'name',
                'description',
                'repository',
                'gitlab_project_id',
                'deleted',
                'updated_at',
                'ubi_app_id')
          })
      })

      it('On fail: should return a verror with meta when no webapps are found ', () => {
        initMocks(sinon.stub().resolves({ rows: [] }))
        const id = 2

        return webappModel.getWebappById(id).should.be.rejected

          .then(err => {
            expect(db.getInstance().query.calledWith('SELECT * FROM webapp WHERE id = $1 AND deleted = false;'))
              .to.equal(true)
            expect(db.getInstance().query.calledOnce).to.equal(true)
            expect(db.getInstance().query.calledTwice).to.equal(false)
            expect(VError.info(err).origin).to.be.a('string')
          })
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
