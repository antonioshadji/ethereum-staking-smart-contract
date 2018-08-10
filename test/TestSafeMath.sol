pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";

contract TestSafeMath {
  using SafeMath for uint;

  function testChainedAdd() public {
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
}

