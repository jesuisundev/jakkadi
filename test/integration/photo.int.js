'use strict'

const path = require('path')
const rp = require('request-promise')
const _ = require('lodash')

require(path.resolve('test/chai'))

const dbHelper = require(path.resolve('test/helpers/pg-helper'))
const { generatePayload } = require(path.resolve('test/helpers/request-helper'))
const fixtures = require(path.resolve('test/fixtures/integration/photo.json'))

describe('Integration test - Photo', () => {
  before(() => {
    return dbHelper.dbDown()
      .then(() => dbHelper.dbUp())
  })

  after(() => dbHelper.dbDown())

  describe('[SCENARIO] Test happy path cases', () => {
    it('GET - Get count photo should respond 200', async () => {
      const options = generatePayload(
        '/jakkadi/v1/photo?count=1',
        'GET',
        {},
        { 'Content-Type': 'application/json' }
      )
      const prom = rp(options)

      return prom.should.be.fulfilled
        .then(res => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.deep.equal({ count: '0' })
        })
    })

    it('POST - Post photo with good payload should respond 201', async () => {
      const currentPayload = _.cloneDeep(fixtures.post.input.valid)
      const options = generatePayload(
        '/jakkadi/v1/photo',
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

    it('GET - Get count photo should respond 200', async () => {
      const options = generatePayload(
        '/jakkadi/v1/photo?count=1',
        'GET',
        {},
        { 'Content-Type': 'application/json' }
      )
      const prom = rp(options)

      return prom.should.be.fulfilled
        .then(res => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.deep.equal({ count: '1' })
        })
    })

    it('GET - Get photo with good payload should respond 200', async () => {
      const options = generatePayload(
        '/jakkadi/v1/photo/1',
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

    it('GET - Get list photo with good payload should respond 200', async () => {
      const options = generatePayload(
        '/jakkadi/v1/photo',
        'GET',
        {},
        { 'Content-Type': 'application/json' }
      )
      const prom = rp(options)

      return prom.should.be.fulfilled
        .then(res => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.be.an('array')
        })
    })

    it('POST - Post same photo should respond 409', async () => {
      const currentPayload = _.cloneDeep(fixtures.post.input.valid)
      const options = generatePayload(
        '/jakkadi/v1/photo',
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

    it('POST - Post photo with bad payload should respond 400', () => {
      const currentPayload = {}
      const options = generatePayload(
        '/jakkadi/v1/photo',
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

    it('DELETE - delete same photo should respond 204', async () => {
      const options = generatePayload(
        '/jakkadi/v1/photo/1',
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

    it('DELETE - delete same photo again should respond 404', async () => {
      const options = generatePayload(
        '/jakkadi/v1/photo/1',
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
