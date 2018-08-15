pragma solidity ^0.4.24;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import './StakeContract.sol';

/* @title Staking Pool Contract */
contract StakePool {
  using SafeMath for uint;
  /** @dev set owner
    */
  address private owner;
  /** @dev address of staking contract
    */
  address public stakeContract;
  StakeContract sc;

  /** @dev track total staked amount
    */
  uint totalStaked;
  /** @dev creates contract
    */
  constructor(address _stakeContract) public {
    owner = msg.sender;
    stakeContract = _stakeContract;
    sc = StakeContract(stakeContract);
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
   sc = StakeContract(stakeContract);
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
    depositedBalances[msg.sender] = depositedBalances[msg.sender].add(msg.value);
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
  function stake() public payable {
    stakedBalances[msg.sender] = stakedBalances[msg.sender].add(msg.value);

    // track total staked
    totalStaked = totalStaked.add(msg.value);

    // record block number for calculating profit distribution
    blockStaked[msg.sender] = block.number;

    // this is how to send ether with a call to an external contract
    sc.deposit.value(msg.value)();

    emit NotifyStaked(
      msg.sender,
      msg.value,
      block.number
    );
  }

  /** @dev unstake funds from stakeContract
    *
    */
  function unstake() public {
    // require(stakedBalances[msg.sender] >= amount);
    // track total staked
    uint amount = stakedBalances[msg.sender];
    stakedBalances[msg.sender] = stakedBalances[msg.sender].sub(amount);
    totalStaked = totalStaked.sub(amount);
    // record block number for calculating profit distribution
    blockUnstaked[msg.sender] = block.number;

    // sc.withdraw(amount, msg.sender);
    sc.withdraw(amount);

    emit NotifyStaked(
      msg.sender,
      amount,
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
    depositedBalances[msg.sender] = depositedBalances[msg.sender].sub(wdValue);
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
  // function () external payable {
  //   // using smallest possible code to make it under 2300 wei gas limit
  //   undistributedFunds += msg.value;
  // }

  event FallBackSP(
    address sender,
    uint value
  );

  function () external payable {
    // depositedBalances[msg.sender] += msg.value;
    emit FallBackSP(msg.sender, msg.value);
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
