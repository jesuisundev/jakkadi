'use strict'

const path = require('path')
require(path.resolve('test/chai'))
const mockery = require('mockery')
const bootstrap = require(path.resolve('test/bootstrap'))

describe('Unit tests - modules - cache manager', () => {
  let cacheStub
  let endStub

  beforeEach(() => {
    bootstrap.tearUp()
  })

  afterEach(() => {
    bootstrap.tearDown()
  })

  function initMocks () {
    endStub = sinon.stub().resolves(Promise.resolve())
    cacheStub = function NodeCache (config) {
      return {
        closeAsync: endStub
      }
    }

    mockery.registerMock('node-cache', cacheStub)
  }

  describe('cacheManager', () => {
    it('Should create instance of cache once and simply return it after', () => {
      initMocks()
      let cacheManager = require(path.resolve('src/modules/cacheManager'))
      let instanceCache = cacheManager.cacheSingleton.getInstance()
      instanceCache = cacheManager.cacheSingleton.getInstance()
      expect(instanceCache).to.be.an('object')
    })

    it('Validate that close works', () => {
      initMocks()
      let cacheManager = require(path.resolve('src/modules/cacheManager'))
      let instanceCache = cacheManager.cacheSingleton.getInstance()
      cacheManager.cacheSingleton.close()

      expect(instanceCache).to.be.an('object')
      expect(endStub.calledOnce).to.equal(true)
    })

    it('Should create instance of cache once and simply return it after when redis is down', () => {
      let cacheManager = require(path.resolve('src/modules/cacheManager'))
      let instanceCache = cacheManager.cacheSingleton.getInstance()
      instanceCache = cacheManager.cacheSingleton.getInstance()
      expect(instanceCache).to.be.an('object')
    })

    it('Validate that close does not crash when no instance created', () => {
      initMocks()
      let cacheManager = require(path.resolve('src/modules/cacheManager'))

      cacheManager.cacheSingleton.close()
      expect(endStub.calledOnce).to.equal(false)
    })
  })
})
