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
      const cacheSingleton = require(path.resolve('src/modules/cacheManager'))
      let instanceCache = cacheSingleton.cacheSingleton.getInstance()
      instanceCache = cacheSingleton.cacheSingleton.getInstance()

      expect(instanceCache).to.be.an('object')
    })

    it('Validate that close works', () => {
      initMocks()
      const cacheSingleton = require(path.resolve('src/modules/cacheManager'))
      const instanceCache = cacheSingleton.cacheSingleton.getInstance()
      cacheSingleton.cacheSingleton.close()

      expect(instanceCache).to.be.an('object')
      expect(endStub.calledOnce).to.equal(true)
    })

    it('Should create instance of cache once and simply return it after when redis is down', () => {
      const cacheSingleton = require(path.resolve('src/modules/cacheManager'))
      let instanceCache = cacheSingleton.cacheSingleton.getInstance()
      instanceCache = cacheSingleton.cacheSingleton.getInstance()

      expect(instanceCache).to.be.an('object')
    })

    it('Validate that close does not crash when no instance created', () => {
      initMocks()
      const cacheSingleton = require(path.resolve('src/modules/cacheManager'))
      cacheSingleton.cacheSingleton.close()

      expect(endStub.calledOnce).to.equal(false)
    })
  })
})
