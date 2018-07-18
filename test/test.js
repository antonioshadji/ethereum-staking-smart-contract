// let describe = require('mocha').describe
// let it = require('mocha').it
let assert = require('chai').assert

// An arrow function expression has a shorter syntax than a function expression
// and does not have its own this, arguments, super, or new.target.
// These function expressions are best suited for non-method functions,
// and they cannot be used as constructors.

describe('Array', () => {
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', () => {
      assert.equal([1, 2, 3].indexOf(4), -1)
    })
  })
})
