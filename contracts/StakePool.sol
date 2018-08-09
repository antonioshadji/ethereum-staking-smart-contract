pragma solidity ^0.4.24;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';

/* @title Staking Pool Contract */
contract StakePool {
  /** @dev set owner
    */
  address owner;

  /** @dev this struct tracks a users balance
    *
    */
  struct UserBalance {
    uint blockNumber;
    uint balance;
  }

  /** @dev track balances of ether deposited to contract
    */
  mapping(address => uint) poolBalances;

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

  /** @dev restrict function to only work when called by owner
    */
  modifier onlyOwner() {
    require(
      msg.sender == owner,
      "only owner can call this function"
    );
    _;
  }

  /** @dev creates contract
    */
  constructor() public {
    owner = msg.sender;
  }

  /** @dev deposit funds to the contract
    */
   function deposit() public payable {
     poolBalances[msg.sender] += msg.value;
     emit NotifyDeposit(msg.sender, msg.value, poolBalances[msg.sender]);
   }

   /** @dev withdrawal funds out of pool
     * @param wdValue amount to withdraw
     * TODO: this must be a request for withdrawal as un-staking takes time
     * not payable, not receiving funds
     */
    function withdraw(uint wdValue) public {
      require(wdValue > 0);
      if (poolBalances[msg.sender] >= wdValue) {
       // open zeppelin sub function to ensure no overflow
       uint startBalance = poolBalances[msg.sender];
       uint newBalance = SafeMath.sub(poolBalances[msg.sender], wdValue);
       poolBalances[msg.sender] = newBalance;
       msg.sender.transfer(wdValue);

      emit NotifyWithdrawal(
        msg.sender,
        startBalance,
        poolBalances[msg.sender],
        wdValue
      );
     }
    }

    /** @dev retreive balance from contract
      * @return uint current value of deposit
      */
    function getBalance() public view returns (uint) {
      return poolBalances[msg.sender];
    }

    /** @dev withdraw profits to owner account
      *
      */
    function getProfits() public onlyOwner {
      // TODO: this is incorrect just testing
      owner.transfer(address(this).balance);
    }
}


  /* example comments for functions */
    /** @dev Calculates a rectangle's surface and perimeter.
      * @param w Width of the rectangle.
      * @param h Height of the rectangle.
      * @return s The calculated surface.
      * @return p The calculated perimeter.
      */
