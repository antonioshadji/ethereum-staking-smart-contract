/* global after, before, web3, artifacts, contract, it */
// Mocha has an implied describe() block, called the “root suite”).
const fs = require('fs')
const p = require('path')
const assert = require('chai').assert
const StakePool = artifacts.require('StakePool')
const StakeContract = artifacts.require('StakeContract')

contract(`stake / unstake functions: ${p.basename(__filename)}`, function (accounts) {
  let poolAddress = null
  let stakeAddress = null
  let log = null
  before('show contract addresses', function () {
    let fn = (new Date()).toISOString()
    fn = fn.slice(11, 19).replace(/:/g, '').concat('.log')
    log = fs.createWriteStream(`./test/logs/${fn}`)
    StakeContract.deployed().then(function (instance) {
      stakeAddress = instance.address
      log.write(`StakeContract: ${instance.address}\n`)
    })
    StakePool.deployed().then(function (instance) {
      poolAddress = instance.address
      log.write(`StakePool: ${instance.address}\n`)
    })
  })

  it(`should show a zero balance in StakeContract`, function () {
    assert.equal(
      web3.eth.getBalance(stakeAddress).valueOf(),
      web3.toWei(0, 'ether'),
      'StakeContract account balance is not as expected'
    )
  })

  it(`should show a zero balance in StakePool`, function () {
    assert.equal(
      web3.eth.getBalance(poolAddress).valueOf(),
      web3.toWei(0, 'ether'),
      'StakeContract account balance is not as expected'
    )
  })

  it(`should be able to send ether to StakeContract`, function () {
    StakePool.deployed().then(function (instance) {
      return instance.stake(
        {
          from: accounts[1],
          value: web3.toWei(1, 'ether'),
          gas: '200000'
        })
    }).then(function (trxObj) {
      log.write(JSON.stringify(trxObj, null, 2))
      assert.equal(trxObj.logs.length, 2, 'there were not only 2 events fired')
      assert.equal(trxObj.logs[0].event, 'NotifyDeposit')
      assert.equal(trxObj.logs[1].event, 'NotifyStaked')
    })
  })

  it(`should show a balance of 1 ether in StakeContract`, function () {
    assert.equal(
      web3.eth.getBalance(stakeAddress).valueOf(),
      web3.toWei(1, 'ether'),
      'StakeContract account balance is not as expected'
    )
  })

  it(`should show a zero balance in StakePool`, function () {
    assert.equal(
      web3.eth.getBalance(poolAddress).valueOf(),
      web3.toWei(0, 'ether'),
      'StakePool account balance is not as expected'
    )
  })

  after('finished', function () {
    log.end()
  })
})
