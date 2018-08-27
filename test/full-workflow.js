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
  let expectedBalance = 3

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
  const tests = accounts.slice(0, 3)

  tests.forEach(function (test, index) {
    it(`StakePool should receive ether for account:${index}`, function () {
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

    it(`should now have balance of 1 ether for account:${index}`, function () {
      return StakePool.deployed().then(function (instance) {
        return instance.getState({from: test})
      }).then(function (stateArr) {
        // state array [0] is deposited balance for user
        assert.equal(stateArr[0].valueOf(), web3.toWei(1, 'ether'),
          'account balance is not 1 ether')
      })
    })
  })

  it(`should now have balance of ${expectedBalance} ether in StakePool`, function () {
    return StakePool.deployed().then(function (instance) {
      return web3.eth.getBalance(instance.address).toNumber()
    }).then(function (balance) {
      assert.equal(balance, web3.toWei(expectedBalance, 'ether'), 'account balance check failed')
    })
  })

  tests.forEach(function (test, index) {
    it(`should allow account:${index} to request that deposited ether is staked in next round`, function () {
      return StakePool.deployed().then(function (instance) {
        return instance.requestNextStakingPeriod({ from: test })
      }).then(function (trxObj) {
        assert.exists(trxObj)
        assert.exists(trxObj.logs)
        assert.equal(trxObj.logs.length, 1)
        assert.equal(trxObj.logs[0].event, 'NotifyStaked')
        log.write(JSON.stringify(trxObj, null, 2))
        log.write('\n')
      })
    })

    it(`should show a requested stake balance for account:${index}`, function () {
      return pool.getState({from: test}).then(function (stateArr) {
        // stateArr[1] is requested stake balance
        assert.equal(stateArr[1], web3.toWei(1, 'ether'), 'request not recorded')
      })
    })

    it(`should show a deposit balance of zero for account:${index}`, function () {
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
    it(`should now have staked balance of 1 ether for account:${index}`, function () {
      return StakePool.deployed().then(function (instance) {
        return instance.getState({from: test})
      }).then(function (stateArr) {
        // stateArr[3] is staked balance
        assert.equal(stateArr[3], web3.toWei(1, 'ether'), 'account balance check failed')
      })
    })
  })

  it(`should have a balance of ${expectedBalance} ether in StakeContract`, function () {
    return StakeContract.deployed().then(function (instance) {
      return web3.eth.getBalance(instance.address).toNumber()
    }).then(function (balance) {
      assert.equal(balance, web3.toWei(expectedBalance, 'ether'), 'account balance check failed')
    })
  })

  it('should have zero balance in StakePool', function () {
    return StakePool.deployed().then(function (instance) {
      return web3.eth.getBalance(instance.address).toNumber()
    }).then(function (balance) {
      assert.equal(balance, 0, 'account balance check failed')
    })
  })

  it(`should be able to calculate profits for staked accounts`, function () {
    // send simulated earnings to StakeContract
    return stak.sendTransaction(
      {
        from: accounts[9],
        value: web3.toWei(1, 'ether')
      }
    ).then(function (obj) {
      assert.exists(obj.logs)
      assert.equal(obj.logs.length, 1)
      assert.exists(obj.logs[0].event)
      assert.equal(obj.logs[0].event, 'FallBackSC')

      return pool.calcNewBalances({from: accounts[0]})
    }).then(function (obj) {
      log.write(JSON.stringify(obj, null, 2))
      assert.exists(obj.logs, 'no logs found')
      assert.equal(obj.logs.length, 5, 'unexpected number of logs')
      obj.logs.forEach((e, i) => {
        if (i === 0) {
          assert.equal(e.event, 'NotifyEarnings')
        } else {
          if (e.args.previousBalance === web3.toWei(1, 'ether')) {
            assert.equal(e.args.newStakeBalance, web3.toWei(1.33, 'ether'))
          }
          if (e.args.previousBalance === web3.toWei(1.33, 'ether')) {
            assert.equal(e.args.newStakeBalance, web3.toWei(1.34, 'ether'))
          }
        }
      })
    })
  })

  tests.forEach(function (test, index) {
    let wdValue = 0
    if (test === accounts[0]) {
      wdValue = 1.34
    } else {
      wdValue = 1.33
    }

    it(`should allow account:${index} to request that ${wdValue} staked ether is unstaked in next round`, function () {
      return StakePool.deployed().then(function (instance) {
        return instance.requestExitAtEndOfCurrentStakingPeriod(
          web3.toWei(wdValue, 'ether'),
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
      log.write('unstake:\n')
      log.write(JSON.stringify(trxObj, null, 2))
      log.write('\n')
      log.write('unstake:\n')
      assert.exists(trxObj)
      assert.exists(trxObj.logs)
      trxObj.logs.forEach(function (e) {
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

  it(`should now have balance of ${expectedBalance + 1} ether in StakePool`, function () {
    return StakePool.deployed().then(function (instance) {
      return web3.eth.getBalance(instance.address).toNumber()
    }).then(function (balance) {
      assert.equal(balance, web3.toWei(expectedBalance + 1, 'ether'), 'account balance check failed')
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

  it('should NOT be able to return greater ether balance than account owns. (fails as expected)', async function () {
    try {
      await StakePool.deployed().then(function (instance) {
        return instance.withdraw(web3.toWei(2, 'ether'), {from: accounts[1]})
      })
    } catch (err) {
      assert.exists(err)
      return
    }
    assert.fail('no error detected')
  })

  tests.forEach(function (test, index) {
    let values = []
    it(`should be able to return ether to correct account: ${index}`, function () {
      return pool.getState({ from: test })
        .then(function (stateArr) {
          assert.lengthOf(stateArr, 4)
          assert.isAbove(parseInt(stateArr[0], 10), 1e18)
          values[index] = stateArr[0]
          log.write(JSON.stringify(stateArr, null, 2) + '\n')
          return pool.withdraw(
            stateArr[0],
            { from: test }
          )
        }).then(function (trxObj) {
          log.write(JSON.stringify(trxObj, null, 2) + '\n')
          // test event fired
          let event = trxObj.logs[0].event
          assert.equal(event, 'NotifyWithdrawal', 'event not received')
          let request = trxObj.logs[0].args.request
          assert.equal(request.valueOf(), values[index], 'request not received')
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
