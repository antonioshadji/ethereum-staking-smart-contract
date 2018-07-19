/* global describe, it, before, App, chai */

/* this file is for inbrowser testing
 * for jquery testing here are ideas
 * https://gist.github.com/robballou/9ee108758dc5e0e2d028
 * */
if (typeof window === 'undefined') {
  global.chai = require('chai')
  global.App = require('../../src/js/app')
  // error self is not defined with truffle test
  // ReferenceError: XMLHttpRequest is not defined with mocha
  // global.Web3 = require('../../src/js/web3.min')
}

describe('Test browser code', () => {
  const assert = chai.assert

  before(function () {
    // runs before all tests in this block
    App.init()
  })

  describe('Test App.js', () => {
    it('App.js should be present', () => {
      assert.exists(App, 'App is null or undefined')
    })
  })

  describe('Detect web3Provider', () => {
    it('should be available', () => {
      assert.isOk(App.web3Provider, 'Provider is not available')
    })
  })
})
