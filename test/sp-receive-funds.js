/* global web3, before, artifacts, contract, it */
// Mocha has an implied describe() block, called the “root suite”).

const fs = require('fs')
const path = require('path')
const assert = require('chai').assert
const StakePool = artifacts.require('StakePool')
const StakeContract = artifacts.require('StakeContract')

contract(`StakePool receive funds: ${path.basename(__filename)}`, function (accounts) {
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

  it(`should have a balance of 1 ether in StakePool`, function () {
    assert.equal(
      web3.eth.getBalance(pool.address).valueOf(),
      web3.toWei(1, 'ether'),
      'StakePool account balance is not as expected'
    )
  })

  it(`StakeContract should generate logs when receiving ether via fallback function`, function () {
    return stak.sendTransaction(
      {
        from: accounts[9],
        value: web3.toWei(2, 'ether')
      }
    ).then(function (trxObj) {
      assert.exists(trxObj)
      log.write(JSON.stringify(trxObj, null, 2) + '\n')
      assert.exists(trxObj.logs)
      assert.isAtLeast(trxObj.logs.length, 1)
    })
  })

  it(`should have a balance of 2 ether in StakeContract`, function () {
    assert.equal(
      web3.eth.getBalance(stak.address).valueOf(),
      web3.toWei(2, 'ether'),
      'StakeContract account balance is not as expected'
    )
  })

  it(`should be able to receive funds from StakeContract`, function () {
    return pool.unstake().then(function (trxObj) {
      assert.exists(trxObj)
      log.write(JSON.stringify(trxObj, null, 2) + '\n')
    })
  })
})
