'use strict'

const path = require('path')
const rp = require('request-promise')
const _ = require('lodash')

require(path.resolve('test/chai'))

const dbHelper = require(path.resolve('test/helpers/pg-helper'))
const { generatePayload } = require(path.resolve('test/helpers/request-helper'))
const fixtures = require(path.resolve('test/fixtures/integration/users.json'))

describe('Integration test - User', () => {
  before(() => {
    return dbHelper.dbDown()
      .then(() => dbHelper.dbUp())
  })

  after(() => dbHelper.dbDown())

  describe('[SCENARIO] Test happy path cases', () => {
    it('POST - Post user with good payload should respond 201', async () => {
      const currentPayload = _.cloneDeep(fixtures.post.input.valid)
      const options = generatePayload(
        `/jakkadi/v1/user`,
        'POST',
        currentPayload,
        { 'Content-Type': 'application/json' }
      )
      const prom = rp(options)

      return prom.should.be.fulfilled
        .then(res => {
          expect(res.statusCode).to.equal(201)
          expect(res.body).to.be.an('object')
        })
    })

    it('GET - Get user with good payload should respond 200', async () => {
      const options = generatePayload(
        `/jakkadi/v1/user/1`,
        'GET',
        {},
        { 'Content-Type': 'application/json' }
      )
      const prom = rp(options)

      return prom.should.be.fulfilled
        .then(res => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.be.an('object')
        })
    })

    it('POST - Post same user should respond 409', async () => {
      const currentPayload = _.cloneDeep(fixtures.post.input.valid)
      const options = generatePayload(
        `/jakkadi/v1/user`,
        'POST',
        currentPayload,
        { 'Content-Type': 'application/json' }
      )
      const prom = rp(options)

      return prom.should.be.rejected
        .then(res => {
          expect(res.statusCode).to.equal(409)
        })
    })

    it('POST - Post user with bad payload should respond 400', () => {
      const currentPayload = {}
      const options = generatePayload(
        `/jakkadi/v1/user`,
        'POST',
        currentPayload,
        { 'Content-Type': 'application/json' }
      )
      const prom = rp(options)

      return prom.should.be.rejected
        .then(res => {
          expect(res.statusCode).to.equal(400)
        })
    })

    it('DELETE - delete same user should respond 204', async () => {
      const options = generatePayload(
        `/jakkadi/v1/user/1`,
        'DELETE',
        {},
        { 'Content-Type': 'application/json' }
      )
      const prom = rp(options)

      return prom.should.be.fulfilled
        .then(res => {
          expect(res.statusCode).to.equal(204)
        })
    })

    it('DELETE - delete same user again should respond 404', async () => {
      const options = generatePayload(
        `/jakkadi/v1/user/1`,
        'DELETE',
        {},
        { 'Content-Type': 'application/json' }
      )
      const prom = rp(options)

      return prom.should.be.rejected
        .then(res => {
          expect(res.statusCode).to.equal(404)
        })
    })
  })
})
