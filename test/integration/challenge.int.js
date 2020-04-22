'use strict'

const path = require('path')
const rp = require('request-promise')
const _ = require('lodash')

require(path.resolve('test/chai'))

const dbHelper = require(path.resolve('test/helpers/pg-helper'))
const { generatePayload } = require(path.resolve('test/helpers/request-helper'))
const fixtures = require(path.resolve('test/fixtures/integration/challenges.json'))

describe('Integration test - Challenge', () => {
  before(() => {
    return dbHelper.dbDown()
      .then(() => dbHelper.dbUp())
  })

  after(() => dbHelper.dbDown())

  describe('[SCENARIO] Test happy path cases', () => {
    it('GET - Get count challenge should respond 200', async () => {
      const options = generatePayload(
        `/jakkadi/v1/challenge?count=1`,
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

    it('POST - Post challenge with good payload should respond 201', async () => {
      const currentPayload = _.cloneDeep(fixtures.post.input.valid)
      const options = generatePayload(
        `/jakkadi/v1/challenge`,
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

    it('GET - Get count challenge should respond 200', async () => {
      const options = generatePayload(
        `/jakkadi/v1/challenge?count=1`,
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

    it('GET - Get challenge with good payload should respond 200', async () => {
      const options = generatePayload(
        `/jakkadi/v1/challenge/1`,
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

    it('GET - Get list challenge with good payload should respond 200', async () => {
      const options = generatePayload(
        `/jakkadi/v1/challenge`,
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

    it('POST - Post challenge with bad payload should respond 400', () => {
      const currentPayload = {}
      const options = generatePayload(
        `/jakkadi/v1/challenge`,
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

    it('GET - Get current challenge with good payload should respond 404', () => {
      const options = generatePayload(
        `/jakkadi/v1/current/challenge/`,
        'GET',
        {},
        { 'Content-Type': 'application/json' }
      )
      const prom = rp(options)

      return prom.should.be.rejected
        .then(res => {
          expect(res.statusCode).to.equal(404)
        })
    })

    it('POST - Post current challenge with good payload should respond 201', () => {
      const currentPayload = _.cloneDeep(fixtures.post.input.valid)
      currentPayload.date_end = new Date(Date.now() + 1 * 24 * 3600 * 1000)
      const options = generatePayload(
        `/jakkadi/v1/challenge`,
        'POST',
        currentPayload,
        { 'Content-Type': 'application/json' }
      )
      const prom = rp(options)

      return prom.should.be.fulfilled
        .then(res => {
          expect(res.statusCode).to.equal(201)
        })
    })

    it('GET - Get current challenge with good payload should respond 200', () => {
      const options = generatePayload(
        `/jakkadi/v1/current/challenge/`,
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

    it('GET - Get photo by challenge with good payload should respond 200', () => {
      const options = generatePayload(
        `/jakkadi/v1/challenge/1/photo/`,
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

    it('DELETE - delete same challenge should respond 204', async () => {
      const options = generatePayload(
        `/jakkadi/v1/challenge/1`,
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

    it('DELETE - delete same challenge again should respond 404', async () => {
      const options = generatePayload(
        `/jakkadi/v1/challenge/1`,
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
