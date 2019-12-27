'use strict'

const FormData = require('form-data')
const _ = require('lodash')
const fetch = require('node-fetch')
require('../chai')
const dbHelper = require('../helpers/pg-helper')
const { postBuild } = require('../helpers/node-fetch-helper')

// fixtures
const buildPayloads = require('../fixtures/build_payloads.json')
const webappPayloads = require('../fixtures/webapp_payloads.json')

// const
const baseURL = 'http://localhost:8085'
const fullURL = `${baseURL}/caravel/v1`

describe('INTEGRATION TEST SUITE: Build endpoints', function () {
  //  needed some build are timeout
  this.timeout(10000)

  describe('[SCENARIO] Test happy path cases', async () => {
    before(() => {
      return dbHelper.dbDown()
        .then(() => dbHelper.dbUp())
    })

    after(() => {
      return dbHelper.dbDown()
    })

    let webapp1
    let webapp2
    let webapp2Builds

    it('POST /webapps should create a new webapp', async () => {
      const data = _.cloneDeep(webappPayloads.payload_1)
      const res = await fetch(`${fullURL}/webapps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: 'ntlm=XXXXX'
        },
        body: JSON.stringify(data)
      })

      assert.isTrue(res.ok, 'POST returns 201')
      assert.equal(res.status, 201, 'returns 201')
      webapp1 = await res.json()
    })

    it('POST second webapp should succeed', async () => {
      const data = _.cloneDeep(webappPayloads.payload_2)
      const res = await fetch(`${fullURL}/webapps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: 'ntlm=XXXXX'
        },
        body: JSON.stringify(data)
      })

      assert.isTrue(res.ok, 'POST returns 201')
      assert.equal(res.status, 201, 'returns 201')
      webapp2 = await res.json()
    })

    it('POST empty build should fail', async () => {
      const payload = _.cloneDeep(buildPayloads.payload_1)
      const form = new FormData()
      form.append('id', payload.id)
      form.append('name', payload.name)
      form.append('url', payload.url)
      form.append('vstage', payload.vstage)

      const res = await fetch(`${fullURL}/webapps/${webapp1.id}/builds`, {
        method: 'POST',
        body: form
      })

      assert.isFalse(res.ok, 'res.ok is false')
      assert.equal(res.status, 400, 'returns 400')
    })

    it('POST /webapps/1/builds should create a new build', async () => {
      const payload = _.cloneDeep(buildPayloads.payload_1)
      const res = await postBuild(payload, webapp1, 'webapp1.zip')
      assert.isTrue(res.ok, 'POST returns 201')
      assert.equal(res.status, 201, 'returns 201')
    })

    it('POST /webapps/1/builds should create a new build', async () => {
      const payload = _.cloneDeep(buildPayloads.payload_2)
      const res = await postBuild(payload, webapp1, 'webapp1.zip')
      assert.isTrue(res.ok, 'POST returns 200')
      assert.equal(res.status, 201, 'returns 201')
    })

    it('POST /webapps/2/builds should create a new build', async () => {
      const payload = _.cloneDeep(buildPayloads.payload_3)
      const res = await postBuild(payload, webapp2, 'webapp1.zip')
      assert.isTrue(res.ok, 'POST returns 201')
      assert.equal(res.status, 201, 'returns 201')
      webapp2Builds = await res.json()
    })

    it('GET all builds for a webapp should succeed', async () => {
      const res = await fetch(`${fullURL}/webapps/${webapp1.id}/builds/`)
      assert.isTrue(res.ok, 'POST returns 200')
      assert.equal(res.status, 200, 'returns 200')
      const body = await res.json()
      expect(body.length).to.equal(2)
    })

    it('GET all builds for a webapp with limit should succeed', async () => {
      const res = await fetch(`${fullURL}/webapps/${webapp1.id}/builds/?limit=1`)
      assert.isTrue(res.ok, 'POST returns 200')
      assert.equal(res.status, 200, 'returns 200')
      const body = await res.json()
      expect(body.length).to.equal(1)
    })

    it('GET all builds for a webapp with limit and offset should succeed', async () => {
      const res = await fetch(`${fullURL}/webapps/${webapp1.id}/builds/?limit=1&offset=1`)
      assert.isTrue(res.ok, 'POST returns 200')
      assert.equal(res.status, 200, 'returns 200')
      const body = await res.json()
      expect(body.length).to.equal(1)
    })

    it('GET all builds for a webapp with limit and offset ordered by name should succeed', async () => {
      const res = await fetch(`${fullURL}/webapps/${webapp1.id}/builds/?limit=2&offset=0&orderby=name`)
      assert.isTrue(res.ok, 'POST returns 200')
      assert.equal(res.status, 200, 'returns 200')
      const body = await res.json()
      expect(body.length).to.equal(2)
      expect(body[0].name).to.deep.equal(buildPayloads.payload_1.name)
      expect(body[1].name).to.deep.equal(buildPayloads.payload_2.name)
    })

    it('GET all builds for a webapp with limit and offset ordered by name DESC should succeed', async () => {
      const res = await fetch(`${fullURL}/webapps/${webapp1.id}/builds/?limit=2&offset=0&orderby=name.desc`)
      assert.isTrue(res.ok, 'POST returns 200')
      assert.equal(res.status, 200, 'returns 200')
      const body = await res.json()
      expect(body.length).to.equal(2)
      expect(body[0].name).to.deep.equal(buildPayloads.payload_2.name)
      expect(body[1].name).to.deep.equal(buildPayloads.payload_1.name)
    })

    it('GET all builds for a webapp with wrong limit should fail', async () => {
      const res = await fetch(`${fullURL}/webapps/${webapp1.id}/builds/?limit=-1`)
      assert.isFalse(res.ok, 'res.ok is false')
      assert.equal(res.status, 400, 'returns 400')
    })

    it('GET all builds for a webapp with limit and wrong offset should fail', async () => {
      const res = await fetch(`${fullURL}/webapps/${webapp1.id}/builds/?limit=1&offset=-1`)
      assert.isFalse(res.ok, 'res.ok is false')
      assert.equal(res.status, 400, 'returns 400')
    })

    it('GET specific build for a webapp should succeed', async () => {
      const res = await fetch(`${fullURL}/webapps/${webapp2.id}/builds/${webapp2Builds.id}`)
      assert.isTrue(res.ok, 'POST returns 200')
      assert.equal(res.status, 200, 'returns 200')
      const body = await res.json()
      expect(body.name).to.deep.equal(buildPayloads.payload_3.name)
    })

    it('PUT build vstage should succeed', async () => {
      const res = await fetch(`${fullURL}/webapps/${webapp2.id}/vstages/staging`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ build_id: webapp2Builds.id })
      })

      assert.isTrue(res.ok, 'res.ok is true')
      assert.equal(res.status, 200, 'PUT returns 200')
    })

    it('PUT build vstage should succeed if vstage length <= 36 chars', async () => {
      const res = await fetch(`${fullURL}/webapps/${webapp2.id}/vstages/12345678901234567890123456789012345a`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ build_id: webapp2Builds.id })
      })

      assert.isTrue(res.ok, 'res.ok is true')
      assert.equal(res.status, 200, 'PUT returns 200')
    })

    it('GET all builds to clean should succeed', async () => {
      const res = await fetch(`${fullURL}/builds/cleanup/`)
      assert.isTrue(res.ok, 'POST returns 200')
      assert.equal(res.status, 200, 'returns 200')
    })

    it('DELETE webapp, ensure that old cached build is not returned', async () => {
      const res = await fetch(`${fullURL}/webapps/${webapp2.id}/`, {
        method: 'DELETE'
      })

      assert.equal(res.status, 200, 'returns 200')
    })

    it('GET all builds for a webapp after webapp deleted should fail', async () => {
      const res = await fetch(`${fullURL}/webapps/${webapp2.id}/builds/`)
      assert.isFalse(res.ok, 'GET returns 404')
      assert.equal(res.status, 404, 'returns 404')
    })

    it('GET specific build for a webapp after webapp deleted should fail', async () => {
      const res = await fetch(`${fullURL}/webapps/${webapp2.id}/builds/${webapp2Builds.id}`)
      assert.isFalse(res.ok, 'GET returns 404')
      assert.equal(res.status, 404, 'returns 404')
    })
  })

  describe('[SCENARIO] Test 4XX level error cases', () => {
    before(() => {
      return dbHelper.dbDown()
        .then(() => dbHelper.dbUp())
    })

    after(() => {
      return dbHelper.dbDown()
    })

    let webapp1
    let webapp1Builds

    it('POST webapp should succeed', async () => {
      const data = _.cloneDeep(webappPayloads.payload_1)
      data.name = 'test400'
      data.slug = 'test400'

      const res = await fetch(`${fullURL}/webapps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: 'ntlm=XXXXX'
        },
        body: JSON.stringify(data)
      })

      assert.isTrue(res.ok, 'POST returns 201')
      webapp1 = await res.json()
    })

    it('POST /webapps/1/builds should create a new build', async () => {
      const payload = _.cloneDeep(buildPayloads.payload_1)
      const res = await postBuild(payload, webapp1, 'webapp1.zip')
      assert.isTrue(res.ok, 'POST returns 201')
      assert.equal(res.status, 201, 'returns 201')
      webapp1Builds = await res.json()
    })

    it('POST build to nonexistent webapp, ensure 404', async () => {
      const payload = _.cloneDeep(buildPayloads.payload_1)
      webapp1.id = 123039
      const res = await postBuild(payload, webapp1, 'webapp1.zip')
      assert.isFalse(res.ok, 'POST returns 404')
      assert.equal(res.status, 404, 'returns 404')
    })

    it('POST invalid build to webapp (vstage fails Joi validation), ensure 400', async () => {
      const payload = _.cloneDeep(buildPayloads.payload_1)
      payload.vstage = ' Fail! '
      const res = await postBuild(payload, webapp1, 'webapp1.zip')
      assert.isFalse(res.ok, 'POST returns 400')
      assert.equal(res.status, 400, 'returns 400')
    })

    it('POST invalid build to webapp (vstage too long - 37 chars), ensure 400', async () => {
      const payload = _.cloneDeep(buildPayloads.payload_1)
      payload.vstage = '123456789012345678901234567890123456a'
      const res = await postBuild(payload, webapp1, 'webapp1.zip')
      assert.isFalse(res.ok, 'POST returns 400')
      assert.equal(res.status, 400, 'returns 400')
    })

    it('PUT build vstage should fail if vstage length > 36 chars', async () => {
      const res = await fetch(`${fullURL}/webapps/${webapp1.id}/vstages/123456789012345678901234567890123456a`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ build_id: webapp1Builds.id })
      })

      assert.isFalse(res.ok, 'res.ok is false')
      assert.equal(res.status, 400, 'PUT returns 400')
    })

    it('PUT vstage to nonexistent webapp, ensure 404', async () => {
      const res = await fetch(`${fullURL}/webapps/23/vstages/staging`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ build_id: webapp1Builds.id })
      })

      assert.isFalse(res.ok, 'res.ok is false')
      assert.equal(res.status, 404, 'PUT returns 404')
    })
  })

  describe('[SCENARIO] Test edge cases', () => {
    let webapp

    before(() => {
      return dbHelper.dbDown()
        .then(() => dbHelper.dbUp())
    })

    after(() => {
      return dbHelper.dbDown()
    })

    it('POST /webapps should create a new webapp', async () => {
      const data = _.cloneDeep(webappPayloads.payload_1)
      const res = await fetch(`${fullURL}/webapps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: 'ntlm=XXXXX'
        },
        body: JSON.stringify(data)
      })

      assert.isTrue(res.ok, 'POST returns 201')
      webapp = await res.json()
    })

    it('POST build archive format tar.xz should fail (only accept proper .zips)', async () => {
      const payload = _.cloneDeep(buildPayloads.payload_1)
      const res = await postBuild(payload, webapp, 'subfolder-test.tar.xz')
      assert.isFalse(res.ok, 'POST returns 400')
      assert.equal(res.status, 400, 'PUT returns 400')
    })

    it('POST build archive format .7zip should fail (only accept proper .zips)', async () => {
      const payload = _.cloneDeep(buildPayloads.payload_1)
      const res = await postBuild(payload, webapp, 'build_linux.7z')
      assert.isFalse(res.ok, 'POST returns 400')
      assert.equal(res.status, 400, 'PUT returns 400')
    })

    it('POST build archive format .tar should fail (only accept proper .zips)', async () => {
      const payload = _.cloneDeep(buildPayloads.payload_1)
      const res = await postBuild(payload, webapp, 'build.tar')
      assert.isFalse(res.ok, 'POST returns 400')
      assert.equal(res.status, 400, 'PUT returns 400')
    })

    it('POST build archive format .wim should fail (only accept proper .zips)', async () => {
      const payload = _.cloneDeep(buildPayloads.payload_1)
      const res = await postBuild(payload, webapp, 'build.wim')
      assert.isFalse(res.ok, 'POST returns 400')
      assert.equal(res.status, 400, 'PUT returns 400')
    })

    it('POST corrupted build archive should fail', async () => {
      const payload = _.cloneDeep(buildPayloads.payload_1)
      const res = await postBuild(payload, webapp, 'corrupted.zip')
      assert.isFalse(res.ok, 'POST returns 400')
      assert.equal(res.status, 400, 'PUT returns 400')
    })

    it('POST corrupted build archive should fail (corruptedFileEnded)', async () => {
      const payload = _.cloneDeep(buildPayloads.payload_1)
      const res = await postBuild(payload, webapp, 'corruptedFileEnded.zip')
      assert.isFalse(res.ok, 'POST returns 400')
      assert.equal(res.status, 400, 'PUT returns 400')
    })

    it('POST valid build archive should succeed (valid.zip)', async () => {
      const payload = _.cloneDeep(buildPayloads.payload_1)
      const res = await postBuild(payload, webapp, 'valid.zip')
      assert.isTrue(res.ok, 'POST returns 201')
      assert.equal(res.status, 201, 'PUT returns 201')
    })

    it('POST valid build archive should succeed even if ".zip" is missing (build_linux.)', async () => {
      const payload = _.cloneDeep(buildPayloads.payload_2)
      const res = await postBuild(payload, webapp, 'build_linux')
      assert.isTrue(res.ok, 'POST returns 201')
      assert.equal(res.status, 201, 'PUT returns 201')
    })
  })

  describe('[SCENARIO] Test 2 webapps with the same build id', () => {
    let webapp1 = null
    let webapp2 = null

    before(() => {
      return dbHelper.dbDown()
        .then(() => dbHelper.dbUp())
    })

    after(() => {
      return dbHelper.dbDown()
    })

    it('POST /webapps should create a new webapp', async () => {
      const data = _.cloneDeep(webappPayloads.payload_1)
      const res = await fetch(`${fullURL}/webapps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: 'ntlm=XXXX'
        },
        body: JSON.stringify(data)
      })
      assert.isTrue(res.ok, 'POST returns 201')
      assert.equal(res.status, 201, 'returns 201')
      webapp1 = await res.json()
    })

    it('POST /webapps should create a new webapp', async () => {
      const data = _.cloneDeep(webappPayloads.payload_2)
      const res = await fetch(`${fullURL}/webapps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: 'ntlm=XXXXX'
        },
        body: JSON.stringify(data)
      })
      assert.isTrue(res.ok, 'POST returns 201')
      assert.equal(res.status, 201, 'returns 201')
      webapp2 = await res.json()
    })

    it('POST valid build - a build uploaded to a webapp should succeed ', async () => {
      const payload = _.cloneDeep(buildPayloads.payload_1)
      const res = await postBuild(payload, webapp1, 'valid.zip')
      assert.isTrue(res.ok, 'POST returns 201')
      assert.equal(res.status, 201, 'returns 201')
    })

    it('POST valid build - a webapp cannot have the same build id twice and should fail', async () => {
      const payload = _.cloneDeep(buildPayloads.payload_1)
      const res = await postBuild(payload, webapp1, 'valid.zip')
      assert.isFalse(res.ok, 'POST returns 409')
      assert.equal(res.status, 409, 'returns 409')
    })

    it('POST valid build - two different webapps can have the same build id and should succeed', async () => {
      const payload = _.cloneDeep(buildPayloads.payload_1)
      const res = await postBuild(payload, webapp2, 'valid.zip')
      assert.isTrue(res.ok, 'POST returns 201')
      assert.equal(res.status, 201, 'returns 201')
    })
  })
})
