/* global assert, artifacts, contract, it */
const StakePool = artifacts.require('StakePool')

contract('StakePool', function (accounts) {
  it('should start with 0 balance', function () {
    return StakePool.deployed().then(function (instance) {
      return instance.getBalance()
    }).then(function (balance) {
      assert.equal(balance.valueOf(), 0, 'first account balance is not 0')
    })
  })
}) // contract end testing
