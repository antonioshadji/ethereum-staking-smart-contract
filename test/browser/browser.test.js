/* global describe, it, before, App, chai */

if (typeof window === 'undefined') {
  global.chai = require('chai')
}

describe('Test browser code', () => {
  const assert = chai.assert

  before(function () {
  // runs before all tests in this block
  })

  describe('Test App.js', () => {
    it('App.js should be present', () => {
      assert.exists(App, 'App is null nor undefined')
    })
  })

  describe('Detect Metamask', () => {
    it('should return true when Metamask is detected', () => {
      assert.isTrue(false, 'test not yet implemented')
    })
  })
})
