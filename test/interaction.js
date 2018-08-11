/* global web3, before, artifacts, contract, it */
// Mocha has an implied describe() block, called the “root suite”).

const assert = require('chai').assert
const StakePool = artifacts.require('StakePool')
const StakeContract = artifacts.require('StakeContract')

contract('StakePool / StakeContract interaction', function (accounts) {
  let pool = null
  let stak = null
  before('setup contract instances', function () {
    StakePool.deployed().then(function (instance) {
      pool = instance
    })
    StakeContract.deployed().then(function (instance) {
      stak = instance
      // console.dir(instance)
    })
  })

  it('should have access to global pool contract', function () {
    assert.isOk(pool, 'StakePool not set')
  })

  it('should have access to global stak contract', function () {
    assert.isOk(stak, 'StakeContract not set')
  })

  it('should allow retreiving address of stake contract', function () {
    assert.isOk(stak.address, 'StakeContract has no address')
  })

  it('should be able to check stake address with getter', async function () {
    // stakeContract is name of public global variable in StakePool contract
    // the compiler created getter, returns a Promise - use async/await
    let a = await pool.stakeContract().then(function (val) { return val })
    assert.isOk(a, 'did not get a value')
    assert.typeOf(a, 'string', 'addresses are strings')
    assert.equal(a.length, 42, 'addresses are 42 character strings')
    assert.notEqual(parseInt(a, 16), 0, 'address is not zero address')
    console.log('\t>', a)
    // console.log(stak.address)
  })

  it('should be able to set StakeContract address', function () {
    pool.setStakeContract(stak.address)
  })

  it('should be able to receive funds from any source', function () {
    let result =
      web3.eth.sendTransaction({
        from: accounts[9],
        to: pool.address,
        value: web3.toWei(1, 'ether')
      })
    assert.isOk(result, 'result returned')
    assert.equal(result.length, 66, 'result is transaction hash')
  })
  it('should be able to check undistributed funds after receiving ether', function () {
    pool.getUndistributedFundsValue().then(function (value) {
      assert.equal(value, web3.toWei(1, 'ether'))
    })
  })
})
