/* global after, artifacts, contract, it, web3 */
// Mocha has an implied describe() block, called the “root suite”).

/* all web3 are synchronous by default, AND can take an optional callback
 * for asynchronous use
 *
 * TruffleContract object turns all smart contract calls into async using
 * Promises
 */
const assert = require('chai').assert
const StakePool = artifacts.require('StakePool')
// const contracts = []

contract('Stakepool External access', function (accounts) {
  // before('setup contract instance', function () {
  //   StakePool.deployed().then(function (instance) {
  //     contracts.push(instance)
  //   })
  // })

  it('should start with zero balance', function () {
    StakePool.deployed().then(function (instance) {
      // console.dir(instance)
      // console.log(instance.address)
      return web3.eth.getBalance(instance.address).toNumber()
    }).then(function (balance) {
      assert.equal(balance, 0, 'account balance check failed')
    })
    // let balance = web3.eth.getBalance(contracts[0].address).valueOf()
  })

  // can also make this an array of objects for multiple input to each test
  const tests = [ accounts[1], accounts[2] ]

  tests.forEach(function (test) {
    it(`should receive ether for account:${test}`, function () {
      StakePool.deployed().then(function (instance) {
        return instance.deposit(
          {
            from: test,
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
      })
    })
  })

  it('should now have balance of 2 ether', function () {
    StakePool.deployed().then(function (instance) {
      return web3.eth.getBalance(instance.address)
    }).then(function (balance) {
      assert.equal(balance.valueOf(), web3.toWei(2, 'ether'), 'account balance check failed')
    })
  })

  it('should allow owner to withdraw profits', function () {
    StakePool.deployed().then(async function (instance) {
      // getProfits returns transactionObject
      // return { trx: instance.getProfits({from: accounts[0]}), i: instance }
      return instance.getProfits({from: accounts[0]})
    }).then(function (obj) {
      // console.log(transactionObject.logs[0].args.previousBal.toNumber())
      assert.property(obj, 'logs', 'return object contains logs property')
      assert.isArray(obj.logs, 'logs array is available')
      assert.isOk(obj.logs, 'logs array has at least one entry')
      assert.isOk(obj.logs[0].args)
      assert.isOk(obj.logs[0].args.finalBal)
      let finalBal = obj.logs[0].args.finalBal.toNumber()
      let balance = web3.eth.getBalance(obj.logs[0].address).toNumber()
      assert.equal(balance, 0, 'web3 should report 0 balance')
      assert.equal(finalBal, 0, 'logs should confirm 0 balance')
    })
  })

  after('return balances to accounts', function () {
    // console.dir(accounts)

    tests.forEach(function (test) {
      web3.eth.sendTransaction({
        from: accounts[0],
        to: test,
        value: web3.toWei(1, 'ether')
      }, cb)
    })
  })
})

function cb (err, result) { if (err) console.log(JSON.stringify(err)) }
