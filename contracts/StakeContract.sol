pragma solidity ^0.4.24;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';

/* @title Mock Staking Contract for testing Staking Pool Contract */
contract StakeContract {
  using SafeMath for uint;

  /** @dev track balances of ether deposited to contract
    */
  mapping(address => uint) depositedBalances;

  /** @dev creates contract
    */
  constructor() public {
  }

  /** @dev trigger notification of deposits
    */
  event NotifyDepositSC(
    address sender,
    uint amount,
    uint balance
  );

  /** @dev deposit funds to the contract
    */
   function deposit() public payable {
     depositedBalances[msg.sender] += msg.value;
     emit NotifyDepositSC(msg.sender, msg.value, depositedBalances[msg.sender]);
   }

  /** @dev trigger notification of withdrawal
    */
  event NotifyWithdrawalSC(
    address sender,
    uint startBal,
    uint finalBal,
    uint request
  );

  /** @dev withdrawal funds out of pool
    * @param wdValue amount to withdraw
    * not payable, not receiving funds
    */
  function withdraw(uint wdValue) public {
    require(depositedBalances[msg.sender] >= wdValue);
    uint startBalance = depositedBalances[msg.sender];
    // open zeppelin sub function to ensure no overflow
    depositedBalances[msg.sender] = depositedBalances[msg.sender].sub(wdValue);

    // transfer & send will hit payee fallback function if a contract
    msg.sender.transfer(wdValue);

    emit NotifyWithdrawalSC(
      msg.sender,
      startBalance,
      depositedBalances[msg.sender],
      wdValue
    );
  }

    event FallBackSC(
      address sender,
      uint value,
      uint blockNumber
    );

  function () external payable {
    // this line caused a revert (not enough gas when contract transfer/send)
    // depositedBalances[msg.sender] += msg.value;
    emit FallBackSC(msg.sender, msg.value, block.number);
  }
}
