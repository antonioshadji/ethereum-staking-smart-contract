/* global web3, before, artifacts, contract, it */
// Mocha has an implied describe() block, called the “root suite”).

const fs = require('fs')
const path = require('path')
const assert = require('chai').assert
const StakePool = artifacts.require('StakePool')
const StakeContract = artifacts.require('StakeContract')

contract(`StakePool StakeContract functions: ${path.basename(__filename)}`, function (accounts) {
  let pool = null
  let stak = null
  let log = null
  before('setup contract instances', function () {
    log = fs.createWriteStream(`./test/logs/testrun.log`)
    log.write(`${(new Date()).toISOString()}\n`)
    log.write('accounts[9]: ' + accounts[9] + '\n')

    StakePool.deployed().then(function (instance) {
      pool = instance
      log.write('pool: ' + pool.address + '\n')
    })
    StakeContract.deployed().then(function (instance) {
      stak = instance
      log.write('stak: ' + stak.address + '\n')
    })
  })

  it(`should have access to global pool contract`, function () {
    assert.exists(pool, 'StakePool not set')
    assert.typeOf(pool, 'Object')
  })

  it(`should have access to global stak contract`, function () {
    assert.exists(stak, 'StakeContract not set')
    assert.typeOf(stak, 'Object')
  })

  it(`should be able to receive funds from any user address`, function () {
    // there is only a 2300 limit on transactions sent via transfer / send
    // web3 can send standard gas with ether
    return web3.eth.sendTransaction(
      {
        from: accounts[9],
        to: pool.address,
        value: web3.toWei(1, 'ether')
      },
      function (err, transactionHash) {
        assert.notExists(err)
        assert.exists(transactionHash)
        assert.equal(transactionHash.length, 66, 'result is transaction hash')
        let trxObj = web3.eth.getTransaction(transactionHash)
        assert.exists(trxObj)
        log.write(JSON.stringify(trxObj, null, 2) + '\n')
        let receipt = web3.eth.getTransactionReceipt(transactionHash)
        assert.exists(receipt)
        log.write(JSON.stringify(receipt, null, 2) + '\n')
      }
    )
  })

  it(`should have a balance of 1 ether in StakePool`, function () {
    assert.equal(
      web3.eth.getBalance(pool.address).valueOf(),
      web3.toWei(1, 'ether'),
      'StakePool account balance is not as expected'
    )
  })
})
