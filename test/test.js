/* global describe, it */
const assert = require('chai').assert
let rootVar = 1000

describe('this is the outer describe', function () {
  const variable = 100
  describe('this is the inner describe', function () {
    it('should see the outer variable', function () {
      assert.equal(variable, 100, 'did not see outer variable')
    })
    it('should see variables set in the root suite', function () {
      assert.equal(rootVar, 1000, 'did not see root variables')
    })
    // this updates variable before any test is run inside THIS describe
    // rootVar = 2000
    // it('should see variables set in the root suite, and updated inside', function () {
    // assert.equal(rootVar, 2000, 'did not see root variables')
    // })
  })
})
