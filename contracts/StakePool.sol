pragma solidity ^0.4.24;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import './StakeContract.sol';

/* @title Staking Pool Contract */
contract StakePool {
  /** @dev set owner
    */
  address private owner;
  /** @dev address of staking contract
    */
  address public stakeContract;

  /** @dev track total staked amount
    */
  uint totalStaked;
  /** @dev creates contract
    */
  constructor(address _stakeContract) public {
    owner = msg.sender;
    stakeContract = _stakeContract;
  }

  /** @dev track balances of ether deposited to contract
    */
  mapping(address => uint) private depositedBalances;

  /** @dev track balances of ether staked to contract
    */
  mapping(address => uint) private stakedBalances;

  /** @dev track block.number when ether was staked
    */
  mapping(address => uint) private blockStaked;
  /** @dev track block.number when ether was unstaked
    */
  mapping(address => uint) private blockUnstaked;

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

  /** @dev trigger notification of deposits
    */
  event NotifyDeposit(
    address sender,
    uint amount,
    uint balance);

  /** @dev deposit funds to the contract
    */
  function deposit() public payable {
    uint newBalance = SafeMath.add(depositedBalances[msg.sender], msg.value);
    depositedBalances[msg.sender] = newBalance;

    emit NotifyDeposit(msg.sender, msg.value, depositedBalances[msg.sender]);
  }

  /** @dev trigger notification of staked amount
    */
  event NotifyStaked(
    address sender,
    uint amount,
    uint blockNum
  );

  /** @dev stake funds to stakeContract
    * http://solidity.readthedocs.io/en/latest/control-structures.html#external-function-calls
    */
   StakeContract sc;
  function stakeTwo() public payable {
    // stakedBalances[msg.sender] =
      // SafeMath.add(stakedBalances[msg.sender], msg.value);

    // track total staked
    // totalStaked = SafeMath.add(totalStaked, msg.value);

    // record block number for calculating profit distribution
    // blockStaked[msg.sender] = block.number;

    sc = StakeContract(stakeContract);
    sc.deposit.value(msg.value)();
    // stakeContract.transfer(msg.value);

    emit NotifyStaked(
      msg.sender,
      msg.value,
      block.number
    );
  }

  /** @dev stake funds to stakeContract
    *
    */
  function stake(uint amount) public {
    require(depositedBalances[msg.sender] >= amount);
    // track total staked
    totalStaked = SafeMath.add(totalStaked, amount);
    // move value from depositedBalances to stakedBalances
    depositedBalances[msg.sender] =
      SafeMath.sub(depositedBalances[msg.sender], amount);
    stakedBalances[msg.sender] =
      SafeMath.add(stakedBalances[msg.sender], amount);
    // record block number for calculating profit distribution
    blockStaked[msg.sender] = block.number;

    stakeContract.transfer(amount);

    emit NotifyStaked(
      msg.sender,
      amount,
      block.number
    );
  }

  /** @dev unstake funds from stakeContract
    *
    */
  function unstake(uint amount) public {
    require(stakedBalances[msg.sender] >= amount);
    // track total staked
    totalStaked = SafeMath.sub(totalStaked, amount);
    // move value from depositedBalances to stakedBalances
    depositedBalances[msg.sender] =
      SafeMath.add(depositedBalances[msg.sender], amount);
    stakedBalances[msg.sender] =
      SafeMath.sub(stakedBalances[msg.sender], amount);
    // record block number for calculating profit distribution
    blockUnstaked[msg.sender] = block.number;

    // TODO: compile error ?
    // /mnt/projects/ethereum/learn/consensys_academy/final_project/contracts/StakePool.sol:140:5: TypeError: Member "withdraw" not found or not visible after argument-dependent lookup in address
    // stakeContract.withdraw(amount);
    // ^--------------------^
   // stakeContract.withdraw(amount);

    emit NotifyStaked(
      msg.sender,
      -amount,
      block.number
    );
  }

  /** @dev trigger notification of withdrawal
    */
  event NotifyWithdrawal(
    address sender,
    uint startBal,
    uint finalBal,
    uint request);

  /** @dev withdrawal funds out of pool
    * @param wdValue amount to withdraw
    * TODO: this must be a request for withdrawal as un-staking takes time
    * not payable, not receiving funds
    */
  function withdraw(uint wdValue) public {
    require(wdValue > 0);
    require(depositedBalances[msg.sender] >= wdValue);
    uint startBalance = depositedBalances[msg.sender];
    // open zeppelin sub function to ensure no overflow
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
    uint previous = address(this).balance;
    owner.transfer(address(this).balance);
    uint finalBal = address(this).balance;
    emit NotifyProfitDrain(previous, finalBal);
  }

  /** @dev hold incoming funds from stake contract
    */
  uint private undistributedFunds;

  /** @dev owner only may retreive undistributedFunds value
    */
  function getUndistributedFundsValue() public view onlyOwner returns (uint) {
    return undistributedFunds;
  }

  /** @dev payable fallback
    * receive funds and keep track of totals
    * it is assumed that only funds received will be from stakeContract
    */
  function () external payable {
    // using smallest possible code to make it under 2300 wei gas limit
    undistributedFunds += msg.value;
  }
}

    // external function can not be called within this contract

  /* example comments for functions */
    /** @dev Calculates a rectangle's surface and perimeter.
      * @param w Width of the rectangle.
      * @param h Height of the rectangle.
      * @return s The calculated surface.
      * @return p The calculated perimeter.
      */
