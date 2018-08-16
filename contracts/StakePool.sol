pragma solidity ^0.4.24;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import './StakeContract.sol';

/* @title Staking Pool Contract */
contract StakePool {
  using SafeMath for uint;

  /** @dev set owner
    */
  address private owner;
  /** @dev owners profits
    */
  uint private ownersProfit;

  /** @dev address of staking contract
    */
  address public stakeContract;
  /** @dev staking contract object to interact with existing contract at known
    * location
    */
  StakeContract sc;

  /** @dev track total staked amount
    */
  uint totalStaked;

  /** @dev track total deposited
    */
  uint totalDeposited;

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

  /** @dev track users
    */
  address[] users;

  /** @dev contract constructor
    */
  constructor(address _stakeContract) public {
    owner = msg.sender;
    stakeContract = _stakeContract;
    sc = StakeContract(stakeContract);
  }

  /** @dev payable fallback
    * it is assumed that only funds received will be from stakeContract
    */
  function () external payable {
    emit FallBackSP(msg.sender, msg.value);
  }

  /** @dev notify when funds received at contract
    */
  event FallBackSP(
    address sender,
    uint value
  );

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

  /** @dev withdraw profits to owner account
    */
  function getOwnersProfits() public onlyOwner {
    // TODO: test again after ownersProfit > 0
    // require(ownersProfit > 0);
    uint valueWithdrawn = ownersProfit;
    owner.transfer(ownersProfit);
    emit NotifyProfitWithdrawal(valueWithdrawn);
  }

  /** @dev notify of owner profit withdraw
    */
  event NotifyProfitWithdrawal(uint valueWithdrawn);

  /** @dev owner only may retreive undistributedFunds value
    */
  function getUndistributedFundsValue() public view onlyOwner returns (uint) {
    return address(this).balance.sub(ownersProfit).sub(totalDeposited);
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
    // track deposited balance (in Pool contract)
    uint toStake = depositedBalances[msg.sender];
    depositedBalances[msg.sender] = 0;
    // track staked balance
    stakedBalances[msg.sender] = stakedBalances[msg.sender].add(toStake);

    // track total staked
    totalStaked = totalStaked.add(toStake);

    // record block number for calculating profit distribution
    blockStaked[msg.sender] = block.number;

    // this is how to send ether with a call to an external contract
    sc.deposit.value(toStake)();

    emit NotifyStaked(
      msg.sender,
      toStake,
      block.number
    );
  }

  /** @dev unstake funds from stakeContract
    *
    */
  function unstake() public {
    // require(stakedBalances[msg.sender] >= amount);
    // track total staked -- always unstake full amount
    uint amount = stakedBalances[msg.sender];
    stakedBalances[msg.sender] = stakedBalances[msg.sender].sub(amount);
    depositedBalances[msg.sender] = depositedBalances[msg.sender].add(amount);
    totalStaked = totalStaked.sub(amount);
    // record block number for calculating profit distribution
    blockUnstaked[msg.sender] = block.number;

    // sc.withdraw(amount, msg.sender);
    sc.withdraw(amount);

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

  /** @dev retreive staked balance from contract
    * @return uint current value of stake deposit
    */
  function getStakedBalance() public view returns (uint) {
    return stakedBalances[msg.sender];
  }
}

  /* example comments for functions */
    /** @dev Calculates a rectangle's surface and perimeter.
      * @param w Width of the rectangle.
      * @param h Height of the rectangle.
      * @return s The calculated surface.
      * @return p The calculated perimeter.
      */
