/* global describe, it, before, App, chai */

if (typeof window === 'undefined') {
  global.chai = require('chai')
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
