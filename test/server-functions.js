/* global after, assert, before, artifacts, contract, it, web3 */
/* Truffle injects all these globals */
// Mocha has an implied describe() block, called the “root suite”).

/* all web3 are synchronous by default, AND can take an optional callback
 * for asynchronous use
 *
 * TruffleContract object turns all smart contract calls into async using
 * Promises
 */
const p = require('path')
const fs = require('fs')
const StakePool = artifacts.require('StakePool')
const StakeContract = artifacts.require('StakeContract')

const fn = p.basename(__filename)

contract(`Stakepool owner access: ${fn}`, function (accounts) {
  // set up global objects
  let pool = null
  let stak = null
  let log = null
  // setup logging and contracts
  before('show contract addresses', function () {
    log = fs.createWriteStream(`./test/logs/${fn}.log`)
    log.write(`${(new Date()).toISOString()}\n`)
    log.write(`web3 version: ${web3.version.api}\n`)
    StakeContract.deployed().then(function (instance) {
      stak = instance
      log.write(`StakeContract: ${instance.address}\n`)
    })
    StakePool.deployed().then(function (instance) {
      pool = instance
      log.write(`StakePool: ${instance.address}\n`)
    })
  })

  it(`should create logs when recieving ether without function call`, function () {
    return pool.sendTransaction(
      {
        from: accounts[9],
        value: web3.toWei(1, 'ether')
      }
    ).then(function (trxObj) {
      assert.exists(trxObj)
      log.write(JSON.stringify(trxObj, null, 2) + '\n')
      assert.exists(trxObj.logs)
      assert.isAtLeast(trxObj.logs.length, 1)
    })
  })

  it(`should be able to set stake address`, function () {
    return StakePool.deployed().then(function (instance) {
      return instance.setStakeContract(stak.address)
    }).then(function (result) {
      log.write(JSON.stringify(result, null, 2) + '\n')
      assert.exists(result.logs)
      assert.isAtLeast(result.logs.length, 1)
      assert.equal(result.logs[0].event, 'NotifyNewSC')
    })
  })

  it.skip('should allow owner to withdraw profits', function () {
    return StakePool.deployed().then(function (instance) {
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

  after('finished', function () {
    log.end()
  })
})
