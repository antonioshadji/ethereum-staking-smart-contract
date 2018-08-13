pragma solidity ^0.4.24;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';

/* @title Mock Staking Contract for testing Staking Pool Contract */
contract StakeContract {

  /** @dev track balances of ether deposited to contract
    */
  mapping(address => uint) depositedBalances;

  /** @dev trigger notification of deposits
    */
  event NotifyReceivedStake(
    address sender,
    uint amount,
    uint balance);

  event NotifyReceivedEther(
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
     emit NotifyReceivedStake(
       msg.sender,
       msg.value,
       depositedBalances[msg.sender]);
   }

   /** @dev withdrawal funds out of pool
     * @param wdValue amount to withdraw
     * TODO: this must be a request for withdrawal as un-staking takes time
     * not payable, not receiving funds
     */
    function withdraw(uint wdValue) public {
      if (depositedBalances[msg.sender] >= wdValue) {
       // open zeppelin sub function to ensure no overflow
       uint startBalance = depositedBalances[msg.sender];
       uint newBalance = SafeMath.sub(depositedBalances[msg.sender], wdValue);
       depositedBalances[msg.sender] = newBalance;
       msg.sender.transfer(wdValue);

      emit NotifyWithdrawal(
        msg.sender,
        startBalance,
        depositedBalances[msg.sender],
        wdValue
      );
     }
    }

    /** @dev retreive balance from contract
      * @return uint current value of deposit
      */
    function getBalance() public view returns (uint) {
      return depositedBalances[msg.sender];
    }

  function () external payable {
    // depositedBalances[msg.sender] += msg.value;
    emit NotifyReceivedEther(
      msg.sender,
      msg.value,
      address(this).balance
    );
  }
}


  /* example comments for functions */
    /** @dev Calculates a rectangle's surface and perimeter.
      * @param w Width of the rectangle.
      * @param h Height of the rectangle.
      * @return s The calculated surface.
      * @return p The calculated perimeter.
      */
