pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";

contract TestSafeMath {
  using SafeMath for uint;

  function testChainedAdd() public {
    // test if using SafeMath for uint modifies original values or only returns
    uint var1 = 2;
    uint var2 = 3;
    uint expected = 5;
    Assert.equal(var1.add(var2), expected, '2+3 should equal 5');
    Assert.equal(var1, 2, 'var1 is not modified');
    Assert.equal(var2, 3, 'var2 is not modified');
  }

  function testChainedAll() public {
    uint var1 = 2;
    uint var2 = 3;
    uint var3 = 7;
    uint var4 = 5;
    Assert.equal(var1.mul(var2).mul(var3).div(var4), 8, 'left to right');
  }

  function testOrderSub() public {
    uint var1 = 100;
    uint var2 = 20;
    Assert.equal(SafeMath.sub(var1, var2), 80, 'first - second');
  }

  function testOrderSubChain() public {
    uint var1 = 10;
    uint var2 = 20;
    Assert.equal(var2.sub(var1), 10, 'not expected');
  }

  function testMultipleSub() public {
    uint var0 = 99;
    uint var1 = 10;
    uint var2 = 20;
    Assert.equal(var0.sub(var1).sub(var2), 69, 'not expected');
  }

  function testFractions() public {
    uint var0 = 1;
    uint var1 = 2;
    Assert.equal(var0.div(var1), 0, 'not expected');
  }

  // by default array in global scope is storage type
  uint[] numbers;
  function testArray() public {
    // push only works for storage arrays
    // (declared in global scope, or with modifier inside function )
    numbers.push(1);
    numbers.push(2);
    numbers.push(3);
    // memory arrays don't have push method
    // numbers[0] = 1;
    // numbers[1] = 2;
    // numbers[2] = 3;

    Assert.equal(numbers.length, 3, 'not expected');
    Assert.equal(numbers[1], 2, 'not expected');
    delete numbers[1];
    Assert.equal(numbers[1], 0, 'not expected');
    Assert.equal(numbers.length, 3, 'not expected');
    numbers[1] = numbers[2];
    numbers.length = 2;
    Assert.equal(numbers[0], 1, 'not expected');
    Assert.equal(numbers[1], 3, 'not expected');
    // throws invalid opcode VM Exception
    // Assert.equal(numbers[2], 3, 'not expected');
  }
}

