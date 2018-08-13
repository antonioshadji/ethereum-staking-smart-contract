/* global before, web3, artifacts, contract, it */
// Mocha has an implied describe() block, called the “root suite”).

const assert = require('chai').assert
const StakePool = artifacts.require('StakePool')
const StakeContract = artifacts.require('StakeContract')

contract('StakePool / StakeContract interaction', function (accounts) {
  let poolAddress = null
  let stakeAddress = null
  before('show contract addresses', function () {
    StakeContract.deployed().then(function (instance) {
      stakeAddress = instance.address
      console.log(`StakeContract: ${instance.address}`)
    })
    StakePool.deployed().then(function (instance) {
      poolAddress = instance.address
      console.log(`StakePool: ${instance.address}`)
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
      return instance.stakeTwo(
        {
          from: accounts[1],
          value: web3.toWei(1, 'ether'),
          gas: '200000'
        })
    }).then(function (trxObj) {
      console.log(`trxObj:\n`)
      console.dir(trxObj)
      console.log(`EOF trxObj`)

      // console.log(`receipt logs count: ${trxObj.receipt.logs.length}`)
      // trxObj.receipt.logs.forEach((e, i) => {
      //   console.log(`Rlog #${i}:\n`)
      //   console.dir(e)
      // })

      console.log(`logs count: ${trxObj.logs.length}`)
      trxObj.logs.forEach((e, i) => {
        console.log(`log #${i}:\n`)
        console.dir(e)
        console.log(`amount: ${trxObj.logs[i].args.amount.valueOf()}`)
      })
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

  it.skip('StakeContract should now have balance of 1 ether for StakePool', function () {
    return StakeContract.deployed().then(function (instance) {
      return instance.getPoolBalance()
    }).then(function (balance) {
      assert.equal(balance.valueOf(), web3.toWei(1, 'ether'),
        'account balance is not 1 ether')
    })
  })

  it.skip(`should show a balance of 1 ether in StakeContract`, function () {
    StakeContract.deployed().then(function (instance) {
      assert.equal(
        web3.eth.getBalance(instance.address).valueOf(),
        web3.toWei(1, 'ether'),
        'account balance is not as expected'
      )
    })
  })
})
