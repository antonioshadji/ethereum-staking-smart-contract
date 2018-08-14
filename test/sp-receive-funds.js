/* global web3, before, artifacts, contract, it */
// Mocha has an implied describe() block, called the “root suite”).

const path = require('path')
const assert = require('chai').assert
const StakePool = artifacts.require('StakePool')
const StakeContract = artifacts.require('StakeContract')

contract(`StakePool StakeContract functions: ${path.basename(__filename)}`, function (accounts) {
  let pool = null
  let stak = null
  before('setup contract instances', function () {
    StakePool.deployed().then(function (instance) {
      pool = instance
    })
    StakeContract.deployed().then(function (instance) {
      stak = instance
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

  it(`global contract instance should have address`, function () {
    assert.exists(stak.address, 'StakeContract has no address')
    assert.exists(pool.address, 'StakePool has no address')
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

  it(`should be able to receive funds from any source`, function () {
    web3.eth.sendTransaction(
      {
        from: accounts[9],
        to: pool.address,
        value: web3.toWei(1, 'ether')
      },
      function (err, transactionHash) {
        assert.notExists(err)
        assert.exists(transactionHash)
        assert.equal(transactionHash.length, 66, 'result is transaction hash')
      }
    )
  })

  it(`should be able to check undistributed funds after receiving ether`, function () {
    pool.getUndistributedFundsValue().then(function (value) {
      assert.equal(value, web3.toWei(1, 'ether'))
    })
  })
})
