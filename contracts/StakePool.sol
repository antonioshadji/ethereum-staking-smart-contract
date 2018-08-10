pragma solidity ^0.4.24;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';

/* @title Staking Pool Contract */
contract StakePool {
  /** @dev set owner
    */
  address private owner;
  /** @dev address of staking contract
    */
  address public stakeContract;
  /** @dev hold incoming funds from stake contract
    */
  uint private undistributedFunds;

  /** @dev creates contract
    */
  constructor() public {
    owner = msg.sender;
  }

  /** @dev track balances of ether deposited to contract
    */
  mapping(address => uint) poolBalances;

  /** @dev track balances of ether deposited to contract
    */
  mapping(address => uint) private depositedBalances;
  mapping(address => uint) private stakedBalances;
  mapping(address => uint) private blockStaked;


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


  /** @dev set staking contract address
    */
   function setStakeContract(address _staker) public onlyOwner {
    stakeContract = _staker;
   }

  /** @dev deposit funds to the contract
    */
   function deposit() public payable {
     uint newBalance = SafeMath.add(depositedBalances[msg.sender], msg.value);
     depositedBalances[msg.sender] = newBalance;

     emit NotifyDeposit(msg.sender, msg.value, depositedBalances[msg.sender]);
   }

   /** @dev withdrawal funds out of pool
     * @param wdValue amount to withdraw
     * TODO: this must be a request for withdrawal as un-staking takes time
     * not payable, not receiving funds
     */
    function withdraw(uint wdValue) public {
      require(wdValue > 0);
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

    event NotifyProfitDrain(uint previousBal, uint finalBal);
    /** @dev withdraw profits to owner account
      */
    function getProfits() public onlyOwner {
      // TODO: this is incorrect just testing
      uint prev = address(this).balance;
      owner.transfer(address(this).balance);
      uint finl = address(this).balance;
      emit NotifyProfitDrain(prev, finl);
    }

    /** @dev payable fallback
      */
     function () external payable {}
}

    // external function can not be called within this contract

  /* example comments for functions */
    /** @dev Calculates a rectangle's surface and perimeter.
      * @param w Width of the rectangle.
      * @param h Height of the rectangle.
      * @return s The calculated surface.
      * @return p The calculated perimeter.
      */
