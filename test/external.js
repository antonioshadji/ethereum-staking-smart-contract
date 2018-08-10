/* global artifacts, contract, it, web3 */
// Mocha has an implied describe() block, called the “root suite”).

const assert = require('chai').assert
const StakePool = artifacts.require('StakePool')

contract('Stakepool External access', function (accounts) {
  it('should start with zero balance', function () {
    StakePool.deployed().then(function (instance) {
      // console.dir(instance)
      // console.log(instance.address)
      return web3.eth.getBalance(instance.address)
    }).then(function (balance) {
      assert.equal(balance.valueOf(), 0, 'account balance check failed')
    })
  })

  it('should be able to receive ether, and emit event', function () {
    return StakePool.deployed().then(function (instance) {
      return instance.deposit(
        {
          from: accounts[1],
          value: web3.toWei(1, 'ether')
        }
      )
    }).then(function (transactionObject) {
      assert.equal(transactionObject.receipt.status, '0x1', 'status failed')
      // event fired and data retrieved from log[]
      let event = transactionObject.logs[0].event
      assert.equal(event, 'NotifyDeposit', 'event not received')
      let amount = transactionObject.logs[0].args.amount
      assert.equal(amount, web3.toWei(1, 'ether'), 'amount not received')
    }).catch(function (err) {
      console.error(err)
    })
  })

  it('should now have balance of 1 ether', function () {
    StakePool.deployed().then(function (instance) {
      return web3.eth.getBalance(instance.address)
    }).then(function (balance) {
      assert.equal(balance.valueOf(), 1, 'account balance check failed')
    })
  })

  it('should be able to receive ether from different account, and emit event', function () {
    return StakePool.deployed().then(function (instance) {
      return instance.deposit(
        {
          from: accounts[2],
          value: web3.toWei(1, 'ether')
        }
      )
    }).then(function (transactionObject) {
      assert.equal(transactionObject.receipt.status, '0x1', 'status failed')
      // event fired and data retrieved from log[]
      let event = transactionObject.logs[0].event
      assert.equal(event, 'NotifyDeposit', 'event not received')
      let amount = transactionObject.logs[0].args.amount
      assert.equal(amount, web3.toWei(1, 'ether'), 'amount not received')
    }).catch(function (err) {
      console.error(err)
    })
  })

  it('should now have balance of 2 ether', function () {
    StakePool.deployed().then(function (instance) {
      return web3.eth.getBalance(instance.address)
    }).then(function (balance) {
      assert.equal(balance.valueOf(), 2, 'account balance check failed')
    })
  })

  it('should allow owner to withdraw profits', function () {
    StakePool.deployed().then(function (instance) {
      instance.getProfits()
      return instance
    }).then(function (instance) {
      let balance = web3.eth.getBalance(instance.address)
      assert.equal(balance, 0, 'did not empty contract')
    })
  })
})
