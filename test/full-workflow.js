/* global after, before, web3, artifacts, contract, it */
// chai is used by default with 'truffle test' command
// Mocha has an implied describe() block, called the “root suite”).
// do not use catch in testing code, assert will be marked as passing

const fs = require('fs')
const p = require('path')
const assert = require('chai').assert
const StakePool = artifacts.require('StakePool')
const StakeContract = artifacts.require('StakeContract')
const fn = p.basename(__filename)

contract(`User StakePool interactionions : ${fn}`, function (accounts) {
  let pool = null
  let stak = null
  let log = null

  before('show contract addresses', function () {
    log = fs.createWriteStream(`./test/logs/${fn}.log`)
    log.write(`${(new Date()).toISOString()}\n`)
    log.write(`web3 version: ${web3.version.api}\n`)
    StakeContract.deployed().then(function (instance) {
      stak = instance
      log.write(`StakeContract: ${stak.address}\n`)
    })
    StakePool.deployed().then(function (instance) {
      pool = instance
      log.write(`StakePool: ${pool.address}\n`)
    })
  })

  it('should start with zero balance in StakePool', function () {
    return StakePool.deployed().then(function (instance) {
      return web3.eth.getBalance(instance.address).toNumber()
    }).then(function (balance) {
      assert.equal(balance, 0, 'account balance check failed')
    })
  })

  it('should start with zero balance in StakeContract', function () {
    return StakeContract.deployed().then(function (instance) {
      return web3.eth.getBalance(instance.address).toNumber()
    }).then(function (balance) {
      assert.equal(balance, 0, 'account balance check failed')
    })
  })

  // can also make this an array of objects for multiple input to each test
  const tests = accounts.slice(1, 3)

  tests.forEach(function (test, index) {
    it(`should receive ether for account:${index + 1}`, function () {
      return StakePool.deployed().then(function (instance) {
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

    it(`should now have balance of 1 ether for account:${index + 1}`, function () {
      return StakePool.deployed().then(function (instance) {
        return instance.getState({from: test})
      }).then(function (stateArr) {
        // state array [0] is deposited balance for user
        assert.equal(stateArr[0].valueOf(), web3.toWei(1, 'ether'),
          'account balance is not 1 ether')
      })
    })
  })

  it('should now have balance of 2 ether in StakePool', function () {
    return StakePool.deployed().then(function (instance) {
      return web3.eth.getBalance(instance.address).toNumber()
    }).then(function (balance) {
      assert.equal(balance, web3.toWei(2, 'ether'), 'account balance check failed')
    })
  })

  tests.forEach(function (test, index) {
    it(`should allow account:${index + 1} to request that deposited ether is staked in next round`, function () {
      return StakePool.deployed().then(function (instance) {
        return instance.requestNextStakingPeriod({ from: test })
      }).then(function (trxObj) {
        assert.exists(trxObj)
        log.write(JSON.stringify(trxObj, null, 2))
        log.write('\n')
      })
    })

    it(`should show a requested stake balance for account:${index + 1}`, function () {
      return pool.getState({from: test}).then(function (stateArr) {
        // stateArr[1] is requested stake balance
        assert.equal(stateArr[1], web3.toWei(1, 'ether'), 'request not recorded')
      })
    })
    it(`should show a deposit balance of zero account:${index + 1}`, function () {
      return pool.getState({from: test}).then(function (stateArr) {
        // state array [0] is deposited balance for user
        assert.equal(stateArr[0], web3.toWei(0, 'ether'), 'deposit not adjusted')
      })
    })
  })

  it(`should be able to stake requested balance for all accounts`, function () {
    return StakePool.deployed().then(function (instance) {
      return instance.stake()
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

  tests.forEach(function (test, index) {
    it(`should now have staked balance of 1 ether for account:${index + 1}`, function () {
      return StakePool.deployed().then(function (instance) {
        return instance.getState({from: test})
      }).then(function (stateArr) {
        // stateArr[3] is staked balance
        assert.equal(stateArr[3], web3.toWei(1, 'ether'), 'account balance check failed')
      })
    })
  })

  it(`should have a balance of 2 ether in StakeContract`, function () {
    return StakeContract.deployed().then(function (instance) {
      return web3.eth.getBalance(instance.address).toNumber()
    }).then(function (balance) {
      assert.equal(balance, web3.toWei(2, 'ether'), 'account balance check failed')
    })
  })

  it('should have zero balance in StakePool', function () {
    return StakePool.deployed().then(function (instance) {
      return web3.eth.getBalance(instance.address).toNumber()
    }).then(function (balance) {
      assert.equal(balance, 0, 'account balance check failed')
    })
  })

  tests.forEach(function (test, index) {
    it(`should allow account:${index + 1} to request that staked ether is unstaked in next round`, function () {
      return StakePool.deployed().then(function (instance) {
        return instance.requestExitAtEndOfCurrentStakingPeriod(
          web3.toWei(1, 'ether'),
          { from: test }
        )
      }).then(function (trxObj) {
        assert.exists(trxObj)
        log.write(JSON.stringify(trxObj, null, 2))
        log.write('\n')
      })
    })
  })

  it(`should be able to unstake requested balances for all accounts`, function () {
    return StakePool.deployed().then(function (instance) {
      return instance.unstake()
    }).then(function (trxObj) {
      log.write(JSON.stringify(trxObj, null, 2))
      log.write('\n')
      assert.exists(trxObj)
      assert.exists(trxObj.logs)
      trxObj.logs.forEach(function (e) {
        log.write(e.event + '\n')
        assert.oneOf(e.event, ['NotifyWithdrawal', 'NotifyStaked', 'NotifyFallback'])
      })
    })
  })

  it('should now have zero balance in StakeContract', function () {
    return StakeContract.deployed().then(function (instance) {
      return web3.eth.getBalance(instance.address).toNumber()
    }).then(function (balance) {
      assert.equal(balance, 0, 'account balance check failed')
    })
  })

  it('should now have balance of 2 ether in StakePool', function () {
    return StakePool.deployed().then(function (instance) {
      return web3.eth.getBalance(instance.address).toNumber()
    }).then(function (balance) {
      assert.equal(balance, web3.toWei(2, 'ether'), 'account balance check failed')
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
    return StakePool.deployed().then(function (instance) {
      return web3.eth.getBalance(instance.address).toNumber()
    }).then(function (balance) {
      assert.equal(balance, 0, 'account balance check failed')
    })
  })

  after('finished', function () {
    log.end()
  })
}) // contract end testing
