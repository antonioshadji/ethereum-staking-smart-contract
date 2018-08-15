/* global artifacts, contract, it, web3 */
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
    return StakePool.deployed().then(function (instance) {
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
    return StakePool.deployed().then(function (instance) {
      // getProfits returns transactionObject
      // return { trx: instance.getProfits({from: accounts[0]}), i: instance }
      return instance.getOwnersProfits({from: accounts[0]})
    }).then(function (obj) {
      // console.log(transactionObject.logs[0].args.previousBal.toNumber())
      assert.property(obj, 'logs', 'return object contains logs property')
      assert.isArray(obj.logs, 'logs array is available')
      assert.isOk(obj.logs, 'logs array has at least one entry')
      assert.isOk(obj.logs[0].args, 'logs contain args')
      assert.isOk(obj.logs[0].args.valueWithdrawn, 'args contain valueWithdrawn')
      let vw = obj.logs[0].args.valueWithdrawn.toNumber()
      assert.equal(vw, 0, 'logs should confirm 0 balance')
    })
  })
})
