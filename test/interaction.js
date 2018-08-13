/* global web3, before, artifacts, contract, it */
// Mocha has an implied describe() block, called the “root suite”).

const path = require('path')
const assert = require('chai').assert
const StakePool = artifacts.require('StakePool')
const StakeContract = artifacts.require('StakeContract')

contract(`StakePool / StakeContract interaction: ${path.basename(__filename)}`, function (accounts) {
  let pool = null
  let stak = null
  before('setup contract instances', async function () {
    await StakePool.deployed().then(function (instance) {
      pool = instance
    })
    await StakeContract.deployed().then(function (instance) {
      stak = instance
      // console.dir(instance)
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

  it(`should be able to check stake address with pool getter`, async function () {
    // stakeContract is name of public global variable in StakePool contract
    // the compiler created getter, returns a Promise - use async/await
    let a = await pool.stakeContract().then(function (val) {
      return val
    })
    assert.exists(a, 'did not get a value')
    assert.typeOf(a, 'string', 'addresses are strings in js')
    assert.equal(a.length, 42, 'addresses are 42 character strings')
    assert.notEqual(parseInt(a, 16), 0, 'address is not zero address')
    assert.equal(a, stak.address)
    // console.log('\t>', a)
  })

  it(`should be able to receive funds from any source`, function () {
    let result =
      web3.eth.sendTransaction({
        from: accounts[9],
        to: pool.address,
        value: web3.toWei(1, 'ether')
      })
    assert.exists(result, 'result returned')
    assert.equal(result.length, 66, 'result is transaction hash')
  })

  it(`should be able to check undistributed funds after receiving ether`, function () {
    pool.getUndistributedFundsValue().then(function (value) {
      assert.equal(value, web3.toWei(1, 'ether'))
    })
  })

  let etherAmount = 2
  it(`should be able to receive ether for given account, and emit event`, function () {
    return pool.deposit(
      {
        from: accounts[1],
        value: web3.toWei(etherAmount, 'ether')
      }
    ).then(function (transactionObject) {
      // event fired and data retrieved from log[]
      let event = transactionObject.logs[0].event
      assert.equal(event, 'NotifyDeposit', 'event not received')
      let amount = transactionObject.logs[0].args.amount
      assert.equal(amount, web3.toWei(etherAmount, 'ether'), 'amount not received')
    })
  })

  it(`should now have balance of ${etherAmount} ether for given account`, function () {
    return pool.getBalance({from: accounts[1]}).then(function (balance) {
      assert.equal(balance.valueOf(), web3.toWei(etherAmount, 'ether'),
        'account balance is not 2 ether')
    })
  })

  it(`should now have total balance of ${etherAmount + 1} ether for contract`, function () {
    assert.equal(
      web3.eth.getBalance(pool.address).valueOf(),
      web3.toWei(etherAmount + 1, 'ether'),
      `account balance is not ${etherAmount + 1} ether`
    )
  })
})
