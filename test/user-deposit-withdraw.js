/* global assert, artifacts, contract, it, web3 */
// chai is used by default with 'truffle test' command
// Mocha has an implied describe() block, called the “root suite”).
// do not use catch in testing code, assert will be marked as passing

const p = require('path')
const StakePool = artifacts.require('StakePool')

contract(`StakePool deposit/withdraw : ${p.basename(__filename)}`, function (accounts) {
  it('should start with zero balance in StakePool', function () {
    StakePool.deployed().then(function (instance) {
      return web3.eth.getBalance(instance.address).toNumber()
    }).then(function (balance) {
      assert.equal(balance, 0, 'account balance check failed')
    })
  })

  // can also make this an array of objects for multiple input to each test
  const tests = accounts.slice(1, 3)

  tests.forEach(function (test, index) {
    it(`should receive ether for account:${index + 1}`, function () {
      StakePool.deployed().then(function (instance) {
        return instance.deposit(
          {
            from: test,
            value: web3.toWei(1, 'ether')
          }
        )
      }).then(function (trxObj) {
        assert.equal(trxObj.receipt.status, '0x1', 'status failed')
        // event fired and data retrieved from log[]
        let event = trxObj.logs[0].event
        assert.equal(event, 'NotifyDeposit', 'event not received')
        let amount = trxObj.logs[0].args.amount
        assert.equal(amount, web3.toWei(1, 'ether'), 'amount not received')
      })
    })
  })

  tests.forEach(function (test, index) {
    it(`should now have balance of 1 ether for account:${index + 1}`, function () {
      return StakePool.deployed().then(function (instance) {
        return instance.getBalance({from: test})
      }).then(function (balance) {
        assert.equal(balance.valueOf(), web3.toWei(1, 'ether'),
          'account balance is not 1 ether')
      })
    })
  })

  it('should NOT be able to return ether to wrong account (fails as expected)', async function () {
    try {
      await StakePool.deployed().then(function (instance) {
        return instance.withdraw(web3.toWei(1, 'ether'), {from: accounts[9]})
      })
    } catch (err) {
      assert.exists(err)
      return
    }
    assert.fail('no error detected')
  })

  tests.forEach(function (test, index) {
    it(`should be able to return ether to correct account: ${index + 1}`, function () {
      return StakePool.deployed().then(function (instance) {
        return instance.withdraw(
          web3.toWei(1, 'ether'),
          {from: test}
        )
      }).then(function (trxObj) {
        // test event fired
        let event = trxObj.logs[0].event
        assert.equal(event, 'NotifyWithdrawal', 'event not received')
        let request = trxObj.logs[0].args.request
        assert.equal(request, web3.toWei(1, 'ether'), 'request not received')
      })
    })
  })

  it('should finish with zero balance in StakePool', function () {
    StakePool.deployed().then(function (instance) {
      return web3.eth.getBalance(instance.address).toNumber()
    }).then(function (balance) {
      assert.equal(balance, 0, 'account balance check failed')
    })
  })
}) // contract end testing
