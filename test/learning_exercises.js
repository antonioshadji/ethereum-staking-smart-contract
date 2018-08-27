/* global before, beforeEach, describe, it , web3, contract, after */
'use strict'
const assert = require('chai').assert
let rootVar = 1000

describe('These tests are learning excercises', function (accounts) {
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

  describe('mocha before hooks', function () {
    before(() => console.log('*** top-level before()'))
    beforeEach(() => console.log('*** top-level beforeEach()'))
    describe('nesting', function () {
      before(() => console.log('*** nested before()'))
      beforeEach(() => console.log('*** nested beforeEach()'))
      it('is a nested spec', () => {
        assert.isOk(true)
      })
    })
  })
})
