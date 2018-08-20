/* global describe, it, before, Srv, App, chai */

/* this file is for inbrowser testing
 * for jquery testing here are ideas
 * https://gist.github.com/robballou/9ee108758dc5e0e2d028
 * */

describe('Test browser code', function () {
  const assert = chai.assert

  before(function () {
    // runs before all tests in this block
    App.init()
    Srv.init()
  })

  describe('App.js', function () {
    it('should be present', function () {
      assert.exists(App, 'App is null or undefined')
    })
  })

  describe('Srv -- server-actions.js', function () {
    it('should be present', function () {
      assert.exists(Srv, 'Srv is null or undefined')
    })
  })

  describe('App web3Provider', function () {
    it('should be available', function () {
      assert.isOk(App.web3Provider, 'Provider is not available')
    })
    describe('Srv web3Provider', function () {
      it('should be available', function () {
        assert.isOk(Srv.web3Provider, 'Provider is not available')
      })
      it('should not be same as App.web3Provider', function () {
        assert.notStrictEqual(Srv.web3Provider, App.web3Provider)
      })
    })
  })
})
