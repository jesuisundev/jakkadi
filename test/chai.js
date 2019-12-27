'use strict'

const chai = require('chai')
global.Promise = require('bluebird')
global.sinon = require('sinon')
const sinonChai = require('sinon-chai')
const chaiAsPromised = require('chai-as-promised')

chai.config.includeStack = true

global.expect = chai.expect
global.AssertionError = chai.AssertionError
global.Assertion = chai.Assertion
global.assert = chai.assert
global.should = chai.should()

chai.should()
chai.use(chaiAsPromised)
chai.use(sinonChai)
