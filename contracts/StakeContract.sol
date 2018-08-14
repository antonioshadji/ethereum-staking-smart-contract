pragma solidity ^0.4.24;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';

/* @title Mock Staking Contract for testing Staking Pool Contract */
contract StakeContract {
  using SafeMath for uint;

  /** @dev track balances of ether deposited to contract
    */
  mapping(address => uint) depositedBalances;

  /** @dev trigger notification of deposits
    */
  event NotifyDeposit(
    address sender,
    uint amount,
    uint balance);

  /** @dev trigger notification of withdrawal
    */
  event NotifyWithdrawal(
    address sender,
    uint startBal,
    uint finalBal,
    uint request);

  /** @dev creates contract
    */
  constructor() public {
  }

  /** @dev deposit funds to the contract
    */
   function deposit() public payable {
     depositedBalances[msg.sender] += msg.value;
     emit NotifyDeposit(msg.sender, msg.value, depositedBalances[msg.sender]);
   }

   /** @dev withdrawal funds out of pool
     * @param wdValue amount to withdraw
     * not payable, not receiving funds
     */
    function withdraw(uint wdValue, address payee) public {
      require(depositedBalances[msg.sender] >= wdValue);
      // open zeppelin sub function to ensure no overflow
      uint startBalance = depositedBalances[msg.sender];
      depositedBalances[msg.sender] = depositedBalances[msg.sender].sub(wdValue);

      // msg.sender.transfer(wdValue);
      payee.transfer(wdValue);

      emit NotifyWithdrawal(
        msg.sender,
        startBalance,
        depositedBalances[msg.sender],
        wdValue
      );
    }

    /** @dev retreive balance from contract
      * @return uint current value of deposit
      */
    function getBalance() public view returns (uint) {
      return depositedBalances[msg.sender];
    }

  function () external payable {
    depositedBalances[msg.sender] += msg.value;
  }
}


  /* example comments for functions */
    /** @dev Calculates a rectangle's surface and perimeter.
      * @param w Width of the rectangle.
      * @param h Height of the rectangle.
      * @return s The calculated surface.
      * @return p The calculated perimeter.
      */
