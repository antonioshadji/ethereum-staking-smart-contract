/* global after, artifacts, contract, it, web3 */
// Mocha has an implied describe() block, called the “root suite”).

/* all web3 are synchronous by default, AND can take an optional callback
 * for asynchronous use
 *
 * TruffleContract object turns all smart contract calls into async using
 * Promises
 */
const p = require('path')
const assert = require('chai').assert
const StakePool = artifacts.require('StakePool')
// const contracts = []

contract(`Stakepool owner access: ${p.basename(__filename)}`, function (accounts) {
  it('should receive ether when sent to instance address', function () {
    StakePool.deployed().then(async function (instance) {
      return web3.eth.sendTransaction(
        {
          from: accounts[9],
          to: instance.address,
          value: web3.toWei(1, 'ether')
        }
      )
    }).then(function (trxObj) {
      assert.exists(trxObj)
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
})
