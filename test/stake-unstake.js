/* global after, before, web3, artifacts, contract, it */
// Mocha has an implied describe() block, called the “root suite”).
const fs = require('fs')
const p = require('path')
const assert = require('chai').assert
const StakePool = artifacts.require('StakePool')
const StakeContract = artifacts.require('StakeContract')

contract(`stake / unstake functions: ${p.basename(__filename)}`, function (accounts) {
  let pool = null
  let stak = null
  let log = null
  before('show contract addresses', function () {
    log = fs.createWriteStream(`./test/logs/${p.basename(__filename)}.log`)
    log.write(`${(new Date()).toISOString()}\n`)
    StakeContract.deployed().then(function (instance) {
      stak = instance
      log.write(`StakeContract: ${instance.address}\n`)
    })
    StakePool.deployed().then(function (instance) {
      pool = instance
      log.write(`StakePool: ${instance.address}\n`)
    })
  })

  it(`should show a zero balance in StakeContract`, function () {
    assert.equal(
      web3.eth.getBalance(stak.address).valueOf(),
      web3.toWei(0, 'ether'),
      'StakeContract account balance is not as expected'
    )
  })

  it(`should show a zero balance in StakePool`, function () {
    assert.equal(
      web3.eth.getBalance(pool.address).valueOf(),
      web3.toWei(0, 'ether'),
      'StakeContract account balance is not as expected'
    )
  })

  it(`should be able to check stake address with pool getter`, function () {
    // stakeContract is name of public global variable in StakePool contract
    // the compiler created getter, returns a Promise
    return pool.stakeContract()
      .then(function (val) {
        return val
      })
      .then(function (a) {
        assert.equal(a, stak.address)
      })
  })

  it(`should be able to stake ether to StakeContract`, function () {
    return StakePool.deployed().then(function (instance) {
      return instance.stake(
        {
          from: accounts[1],
          value: web3.toWei(1, 'ether'),
          gas: '200000'
        }
      )
    }).then(function (trxObj) {
      assert.exists(trxObj)
      log.write(JSON.stringify(trxObj, null, 2))
      log.write('\n')

      assert.exists(trxObj.logs)
      trxObj.logs.forEach(function (e) {
        assert.oneOf(e.event, ['NotifyDepositSC', 'NotifyStaked'])
      })
    })
  })

  it(`should show a balance of 1 ether in StakeContract`, function () {
    assert.equal(
      web3.eth.getBalance(stak.address).valueOf(),
      web3.toWei(1, 'ether'),
      'StakeContract account balance is not as expected'
    )
  })

  it(`should show a zero balance in StakePool`, function () {
    assert.equal(
      web3.eth.getBalance(pool.address).valueOf(),
      web3.toWei(0, 'ether'),
      'StakePool account balance is not as expected'
    )
  })

  it(`should be able to unstake ether from StakeContract`, function () {
    return StakePool.deployed().then(function (instance) {
      return instance.unstake(
        {
          from: accounts[1],
          gas: '300000'
        }
      )
    }).then(function (trxObj) {
      log.write(JSON.stringify(trxObj, null, 2))
      log.write('\n')
      assert.exists(trxObj)
      assert.exists(trxObj.logs)
      trxObj.logs.forEach(function (e) {
        assert.oneOf(e.event, ['NotifyWithdrawal', 'NotifyStaked', 'FallBackSP'])
      })
    })
  })

  it(`should show a balance of 0 ether in StakeContract`, function () {
    assert.equal(
      web3.eth.getBalance(stak.address).valueOf(),
      web3.toWei(0, 'ether'),
      'StakeContract account balance is not as expected'
    )
  })

  it(`should show a 1 balance in StakePool`, function () {
    assert.equal(
      web3.eth.getBalance(pool.address).valueOf(),
      web3.toWei(1, 'ether'),
      'StakePool account balance is not as expected'
    )
  })
  after('finished', function () {
    log.end()
  })
})
