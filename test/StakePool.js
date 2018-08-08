/* global after, describe, assert, artifacts, contract, it, web3 */
// chai is used by default with 'truffle test' command
// Mocha has an implied describe() block, called the “root suite”).

const StakePool = artifacts.require('StakePool')

describe('Test Environment', function () {
  it('should have access to web3', function () {
    assert(web3, 'web3 is not defined')
  })
  it('should be using web3 version 0.20.x', function () {
    let re = /0\.20\.\d/
    assert(re.test(web3.version.api), 'web3 is not version 0.20.x')
    // console.log(`web3 version: ${web3.version.api}`)
  })
  it('should be using chai', function () {
    // isNotOk is not available in nodejs assert
    assert.isNotOk(false, 'this will pass')
  })
  it('should allow multiple asserts', function () {
    assert.isOk(true, 'failed true')
    assert.isNotOk(false, 'failed false')
  })
})

contract('Test Environment', function (accounts) {
  it('should have multiple accounts available', function () {
    assert(accounts.length, 'Must be greater than 0 accounts')
  })

  after(function () {
    console.log(`accounts available: ${accounts.length}`)
    for (let i = 0; i < accounts.length; i++) {
      let balance = web3.eth.getBalance(accounts[i])
      console.log(`${accounts[i]} ${web3.fromWei(balance, 'ether')}`)
    }
  })
})

contract('StakePool', function (accounts) {
  it('should start with 0 balance for given account', function () {
    return StakePool.deployed().then(function (instance) {
      return instance.getBalance({from: accounts[0]})
    }).then(function (balance) {
      assert.equal(balance.valueOf(), 0, 'account balance is not 0')
    })
  })

  it('should be able to receive ether for given account, and emit event', function () {
    return StakePool.deployed().then(function (instance) {
      return instance.deposit(
        {
          from: accounts[0],
          value: web3.toWei(1, 'ether')
        }
      )
    }).then(function (transactionObject) {
      assert.equal(transactionObject.receipt.status, '0x1', 'status failed')
      // event fired and data retrieved from log[]
      let event = transactionObject.logs[0].event
      assert.equal(event, 'NotifyDeposit', 'event not received')
      let amount = transactionObject.logs[0].args.amount
      assert.equal(amount, web3.toWei(1, 'ether'), 'amount not received')
    }).catch(function (err) {
      console.error(err)
    })
  })

  it('should now have balance of 1 ether for given account', function () {
    return StakePool.deployed().then(function (instance) {
      return instance.getBalance({from: accounts[0]})
    }).then(function (balance) {
      assert.equal(balance.valueOf(), web3.toWei(1, 'ether'),
        'account balance is not 1 ether')
    })
  })

  it('should be able to return ether to given account, and emit event', function () {
    return StakePool.deployed().then(function (instance) {
      return instance.withdraw(web3.toWei(1, 'ether'), {from: accounts[0]})
    }).then(function (transactionObject) {
      // assert.equal(transactionObject.receipt.status, '0x1', 'status failed')
      // test event fired
      let event = transactionObject.logs[0].event
      assert.equal(event, 'NotifyWithdrawal', 'event not received')
      let request = transactionObject.logs[0].args.request
      assert.equal(request, web3.toWei(1, 'ether'), 'request not received')
    }).catch(function (err) {
      console.error(err)
    })
  })

  it('should finish with test with 0 balance for given account', function () {
    return StakePool.deployed().then(function (instance) {
      return instance.getBalance({from: accounts[0]})
    }).then(function (balance) {
      assert.equal(balance.valueOf(), 0, 'account balance is not 0')
    })
  })
}) // contract end testing

// this is sample code
// function testSendEther(value, target, account) {
//   web3.eth.sendTransaction({
//     from: account,
//     to: target,
//     value: web3.toWei(value, 'ether')
//   }, (err, result)  {
//     if (err) {
//       console.log('Error: ', err)
//     } else {
//       console.log('Success: ', result)
//     }
//   })
// }
//
// this is what a transactionObject looks like
// { tx: '0xf62b031a27ac9a460572a470447f6b396ea4b8fbc57c67ee1d6b3244ad32377a',
//   receipt:
//    { transactionHash: '0xf62b031a27ac9a460572a470447f6b396ea4b8fbc57c67ee1d6b3244ad32377a',
//      transactionIndex: 0,
//      blockHash: '0x24bba9d5410a0260ddfca23f002729794e6b8d18ff8ba36afe33fe6822c93bfa',
//      blockNumber: 105,
//      gasUsed: 43670,
//      cumulativeGasUsed: 43670,
//      contractAddress: null,
//      logs: [ [Object] ],
//      status: '0x1',
//      logsBloom: '0x00000400000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000' },
//   logs:
//    [ { logIndex: 0,
//        transactionIndex: 0,
//        transactionHash: '0xf62b031a27ac9a460572a470447f6b396ea4b8fbc57c67ee1d6b3244ad32377a',
//        blockHash: '0x24bba9d5410a0260ddfca23f002729794e6b8d18ff8ba36afe33fe6822c93bfa',
//        blockNumber: 105,
//        address: '0x9dd702718d749a17df476eafe1c3d69be2c99839',
//        type: 'mined',
//        event: 'NotifyDeposit',
//        args: [Object] } ] }
