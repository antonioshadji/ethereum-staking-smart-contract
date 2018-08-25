pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "../contracts/StakeContract.sol";
import "../contracts/StakePool.sol";

contract TestSafeMath {
  using SafeMath for uint;

  // https://truffleframework.com/docs/truffle/testing/writing-tests-in-solidity#testing-ether-transactions
  uint public initialBalance = 6 ether;

  // this test is a learning excercise to verify how initialBalance works in practice
  function testSendEtherInitialize() public {
   // StakePool sp = StakePool(DeployedAddresses.StakePool());
   //  StakeContract sc = StakeContract(DeployedAddresses.StakeContract());
    Assert.equal(initialBalance, 6 ether, 'test ether value');
    Assert.equal(initialBalance, 6000000000000000000, 'test wei value');
    // initialBalance allows to send up to a limit of ether but does not deposit
    // the balance directly into the contracts balance. Ether must be transfered
    DeployedAddresses.StakeContract().transfer(1 ether);
    Assert.balanceEqual(DeployedAddresses.StakeContract(), 1 ether, 'SC balance not increased');

    DeployedAddresses.StakeContract().transfer(2 ether);
    DeployedAddresses.StakePool().transfer(3 ether);
    Assert.balanceEqual(DeployedAddresses.StakeContract(), 3000000000000000000, 'SC did not receive eth');
    Assert.balanceEqual(DeployedAddresses.StakePool(), 3 ether, 'SP did not receive eth');
  }

  // this test is learning excercise to verify how SafeMath library functions
  function testChainedAdd() public {
    // test if using SafeMath for uint modifies original values or only returns
    uint var1 = 2;
    uint var2 = 3;
    uint expected = 5;
    Assert.equal(var1.add(var2), expected, '2+3 should equal 5');
    Assert.equal(var1, 2, 'var1 is not modified');
    Assert.equal(var2, 3, 'var2 is not modified');
  }

  // this test is learning excercise to verify how SafeMath library functions
  function testChainedAll() public {
    uint var1 = 2;
    uint var2 = 3;
    uint var3 = 7;
    uint var4 = 5;
    Assert.equal(var1.mul(var2).mul(var3).div(var4), 8, 'left to right');
  }

  // this test is learning excercise to verify how SafeMath library functions
  function testOrderSub() public {
    uint var1 = 100;
    uint var2 = 20;
    Assert.equal(SafeMath.sub(var1, var2), 80, 'first - second');
  }

  // this test is learning excercise to verify how SafeMath library functions
  function testOrderSubChain() public {
    uint var1 = 10;
    uint var2 = 20;
    Assert.equal(var2.sub(var1), 10, 'not expected');
  }

  // this test is learning excercise to verify how SafeMath library functions
  function testMultipleSub() public {
    uint var0 = 99;
    uint var1 = 10;
    uint var2 = 20;
    Assert.equal(var0.sub(var1).sub(var2), 69, 'not expected');
  }

  // this test is learning excercise to verify how SafeMath library functions
  function testFractions() public {
    uint var0 = 1;
    uint var1 = 2;
    Assert.equal(var0.div(var1), 0, 'not expected');
  }

  // this test is learning excercise to verify how solidity handles decimals
  function testDecimals() public {
    uint a = 0.99 * 100;
    Assert.equal(a, 99, 'not expected');
  }

  // by default array in global scope is storage type
  uint[] numbers;
  // this test is learning excercise to verify how solidity arrays operate
  function testArray() public {
    // push only works for storage arrays
    // (declared in global scope, or with modifier inside function )
    numbers.push(1);
    numbers.push(2);
    uint l = numbers.push(3);
    Assert.equal(l, 3, 'expected push to return length');
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
    uint[] memory state = new uint[](4);
    Assert.equal(state[0], 0, 'not expected');
    Assert.equal(state[3], 0, 'not expected');
  }
}

