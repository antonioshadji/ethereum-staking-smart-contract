/* global describe, it , web3, contract, after */
const assert = require('chai').assert
let rootVar = 1000

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

  contract('Test Environment', function (accounts) {
    it('should have multiple accounts available', function () {
      assert(accounts.length, 'Must be greater than 0 accounts')
    })

    after(function () {
      let spacer = '      '
      console.log(`${spacer}accounts available: ${accounts.length}`)
      for (let i = 0; i < accounts.length; i++) {
        let balance = web3.eth.getBalance(accounts[i])
        console.log(`${spacer}${accounts[i]} ${web3.fromWei(balance, 'ether')}`)
      }
    })
  })
})

describe('this is the outer describe', function () {
  const variable = 100
  describe('this is the inner describe', function () {
    it('should see the outer variable', function () {
      assert.equal(variable, 100, 'did not see outer variable')
    })
    it('should see variables set in the root suite', function () {
      assert.equal(rootVar, 1000, 'did not see root variables')
    })
    it('should include key a', function () {
      assert.property({ a: 1 }, 'a')
    })
    // this updates variable before any test is run inside THIS describe
    // rootVar = 2000
    // it('should see variables set in the root suite, and updated inside', function () {
    // assert.equal(rootVar, 2000, 'did not see root variables')
    // })
  })
})



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
