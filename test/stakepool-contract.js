/* global after, describe, assert, artifacts, contract, it, web3 */
// chai is used by default with 'truffle test' command
// Mocha has an implied describe() block, called the “root suite”).
// do not use catch in testing code, assert will be marked as passing

const StakePool = artifacts.require('StakePool')

describe('Test Environment', function () {
  it('should have access to web3', function () {
    assert(web3, 'web3 is not defined')
  })
  it('should be using web3 version 0.20.x', function () {
    let re = /0\.20\.\d/
    assert(re.test(web3.version.api), 'web3 is not version 0.20.x')
    // console.log(`web3 version: ${web3.version.api}`)
  })
  it('should be using chai', function () {
    // isNotOk is not available in nodejs assert
    assert.isNotOk(false, 'this will pass')
  })
  it('should allow multiple asserts', function () {
    assert.isOk(true, 'failed true')
    assert.isNotOk(false, 'failed false')
  })

  contract('Test Environment', function (accounts) {
    it('should have multiple accounts available', function () {
      assert(accounts.length, 'Must be greater than 0 accounts')
    })

    after(function () {
      let spacer = '      '
      console.log(`${spacer}accounts available: ${accounts.length}`)
      for (let i = 0; i < accounts.length; i++) {
        let balance = web3.eth.getBalance(accounts[i])
        console.log(`${spacer}${accounts[i]} ${web3.fromWei(balance, 'ether')}`)
      }
    })
  })
})

contract('StakePool', function (accounts) {
  it('should start with 0 balance for given account', function () {
    return StakePool.deployed().then(function (instance) {
      return instance.getBalance({from: accounts[0]})
    }).then(function (balance) {
      assert.equal(balance.valueOf(), 0, 'account balance is not 0')
    })
  })

  it('should be able to receive ether for given account, and emit event', function () {
    return StakePool.deployed().then(function (instance) {
      return instance.deposit(
        {
          from: accounts[0],
          value: web3.toWei(1, 'ether')
        }
      )
    }).then(function (transactionObject) {
      // event fired and data retrieved from log[]
      let event = transactionObject.logs[0].event
      assert.equal(event, 'NotifyDeposit', 'event not received')
      let amount = transactionObject.logs[0].args.amount
      assert.equal(amount, web3.toWei(1, 'ether'), 'amount not received')
    })
  })

  it('should now have balance of 1 ether for given account', function () {
    return StakePool.deployed().then(function (instance) {
      return instance.getBalance({from: accounts[0]})
    }).then(function (balance) {
      assert.equal(balance.valueOf(), web3.toWei(1, 'ether'),
        'account balance is not 1 ether')
    })
  })

  it('should NOT be able to return ether to wrong account', function () {
    return StakePool.deployed().then(function (instance) {
      return instance.withdraw(web3.toWei(1, 'ether'), {from: accounts[9]})
    }).then(function (transactionObject) {
      assert.equal(transactionObject.logs.length, 0, 'transaction succeeded')
    })
  })

  it('should be able to return ether to correct account, and emit event', function () {
    return StakePool.deployed().then(function (instance) {
      return instance.withdraw(web3.toWei(1, 'ether'), {from: accounts[0]})
    }).then(function (transactionObject) {
      // assert.equal(transactionObject.receipt.status, '0x1', 'status failed')
      // test event fired
      let event = transactionObject.logs[0].event
      assert.equal(event, 'NotifyWithdrawal', 'event not received')
      let request = transactionObject.logs[0].args.request
      assert.equal(request, web3.toWei(1, 'ether'), 'request not received')
    })
  })

  it('should finish with test with 0 balance for given account', function () {
    return StakePool.deployed().then(function (instance) {
      return instance.getBalance({from: accounts[0]})
    }).then(function (balance) {
      assert.equal(balance.valueOf(), 0, 'account balance is not 0')
    })
  })
}) // contract end testing
