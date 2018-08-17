/* global describe, it, before, App, chai */

/* this file is for inbrowser testing
 * for jquery testing here are ideas
 * https://gist.github.com/robballou/9ee108758dc5e0e2d028
 * */

describe('Test browser code', function () {
  const assert = chai.assert

  before(function () {
    // runs before all tests in this block
    App.init()
  })

  describe('App.js', function () {
    it('should be present', function () {
      assert.exists(App, 'App is null or undefined')
    })
  })

  describe('web3Provider', function () {
    it('should be available', function () {
      assert.isOk(App.web3Provider, 'Provider is not available')
    })
  })
})
