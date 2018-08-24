pragma solidity ^0.4.24;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import 'zeppelin-solidity/contracts/lifecycle/Pausable.sol';
import './StakeContract.sol';

/* @title Staking Pool Contract
 * Open Zeppelin Pausable is Ownable.  contains address owner */
contract StakePool is Pausable {
  using SafeMath for uint;

  /** @dev address of staking contract
    * this variable is set at construction, and can be changed only by owner.*/
  address private stakeContract;
  /** @dev staking contract object to interact with staking mechanism.
    * this is a mock contract.  */
  StakeContract private sc;

  /** @dev track total staked amount */
  uint private totalStaked;
  /** @dev track total deposited to pool */
  uint private totalDeposited;

  /** @dev track balances of ether deposited to pool */
  mapping(address => uint) private depositedBalances;
  /** @dev track balances of ether staked */
  mapping(address => uint) private stakedBalances;
  /** @dev track user request to enter next staking period */
  mapping(address => uint) private requestStake;
  /** @dev track user request to exit current staking period */
  mapping(address => uint) private requestUnStake;

  /** @dev track users
    * users must be tracked in this array because mapping is not iterable */
  address[] private users;
  /** @dev track index by address added to users */
  mapping(address => uint) private userIndex;

  /** @dev notify when funds received from staking contract
    * @param sender       msg.sender for the transaction
    * @param amount       msg.value for the transaction
    * @param blockNumber  block.number of the transaction for record keeping
   */
  event NotifyFallback(address sender, uint amount, uint blockNumber);

  /** @dev notify that StakeContract address has been changed 
    * @param oldSC old address of the staking contract
    * @param newSC new address of the staking contract
   */
  event NotifyNewSC(address oldSC, address newSC);

  /** @dev trigger notification of deposits
    * @param sender  msg.sender for the transaction
    * @param amount  msg.value for the transaction
    * @param balance the users balance including this deposit
   */
  event NotifyDeposit(address sender, uint amount, uint balance);

  /** @dev trigger notification of staked amount
    * @param sender       msg.sender for the transaction
    * @param amount       msg.value for the transaction
    * @param blockNumber  block.number of the transaction for record keeping
    */
  event NotifyStaked(address sender, uint amount, uint blockNumber);

  /** @dev trigger notification of change in users staked balances
    * @param user            address of user
    * @param previousBalance users previous staked balance
    * @param newStakeBalence users new staked balance
    */
  event NotifyUpdate(address user, uint previousBalance, uint newStakeBalence);

  /** @dev trigger notification of withdrawal
    * @param sender   address of msg.sender
    * @param startBal users starting balance
    * @param finalBal users final balance after withdrawal
    * @param request  users requested withdraw amount
    */
  event NotifyWithdrawal(
    address sender,
    uint startBal,
    uint finalBal,
    uint request);

  /** @dev contract constructor
    * @param _stakeContract the address of the staking contract/mechanism
    */
  constructor(address _stakeContract) public {
    require(_stakeContract != address(0));
    stakeContract = _stakeContract;
    sc = StakeContract(stakeContract);
    // set owner to users[0] because unknown user will return 0 from userIndex
    // this also allows owners to withdraw their own earnings using same
    // functions as regular users
    users.push(owner);
  }

  /** @dev payable fallback
    * it is assumed that only funds received will be from stakeContract */
  function () external payable {
    emit NotifyFallback(msg.sender, msg.value, block.number);
  }

  /************************ USER MANAGEMENT **********************************/

  /** @dev test if user is in current user list
    * @param _user address of user to test if in list
    * @return true if user is on record, otherwise false
    */
  function isExistingUser(address _user) private view returns (bool) {
    if ( userIndex[_user] == 0) {
      return false;
    }
    return true;
  }

  /** @dev remove a user from users array
    * @param _user address of user to remove from the list
    */
  function removeUser(address _user) private {
    if (_user == owner ) return;
    uint index = userIndex[_user];
    // user is not last user
    if (index < users.length.sub(1)) {
      address lastUser = users[users.length.sub(1)];
      users[index] = lastUser;
      userIndex[lastUser] = index;
    }
    // this line removes last user
    users.length = users.length.sub(1);
  }

  /** @dev add a user to users array
    * @param _user address of user to add to the list
    */
  function addUser(address _user) private {
    if (_user == owner ) return;
    if (isExistingUser(_user)) return;
    users.push(_user);
    // new user is currently last in users array
    userIndex[_user] = users.length.sub(1);
  }

  /************************ USER MANAGEMENT **********************************/

  /** @dev set staking contract address
    * @param _stakeContract new address to change staking contract / mechanism
    */
  function setStakeContract(address _stakeContract) public onlyOwner {
    require(_stakeContract != address(0));
    address oldSC = stakeContract;
    stakeContract = _stakeContract;
    sc = StakeContract(stakeContract);
    emit NotifyNewSC(oldSC, stakeContract);
  }

  /** @dev stake funds to stakeContract
    */
  function stake() public onlyOwner {
    // * update mappings
    // * send total balance to stakeContract
    uint toStake;
    for (uint i = 0; i < users.length; i++) {
      uint amount = requestStake[users[i]];
      toStake = toStake.add(amount);
      stakedBalances[users[i]] = stakedBalances[users[i]].add(amount);
      requestStake[users[i]] = 0;
    }

    // track total staked
    totalStaked = totalStaked.add(toStake);

    address(sc).transfer(toStake);

    emit NotifyStaked(msg.sender, toStake, block.number);
  }

  /** @dev unstake funds from stakeContract
    */
  function unstake() public onlyOwner {
    uint unStake;
    for (uint i = 0; i < users.length; i++) {
      uint amount = requestUnStake[users[i]];
      unStake = unStake.add(amount);
      stakedBalances[users[i]] = stakedBalances[users[i]].sub(amount);
      depositedBalances[users[i]] = depositedBalances[users[i]].add(amount);
      requestUnStake[users[i]] = 0;
    }

    // track total staked
    totalStaked = totalStaked.sub(unStake);

    sc.withdraw(unStake);

    emit NotifyStaked(msg.sender, -unStake, block.number);
  }

  /** @dev calculated new stakedBalances
    * @return true if calc is successful, otherwise false
    */
  function calcNewBalances() public onlyOwner returns (bool) {
    uint earnings = address(sc).balance.sub(totalStaked);
    uint ownerProfit = earnings.div(100);
    earnings = earnings.sub(ownerProfit);

    if (totalStaked > 0 && earnings > 0) {
      for (uint i = 0; i < users.length; i++) {
        uint currentBalance = stakedBalances[users[i]];
        stakedBalances[users[i]] =
          currentBalance.add(
            earnings.mul(99).div(100).mul(currentBalance).div(totalStaked)
          );
        emit NotifyUpdate(users[i], currentBalance, stakedBalances[users[i]]);
      }
      stakedBalances[owner] = stakedBalances[owner].add(ownerProfit);
      totalStaked = address(sc).balance;
      return true;
    }
    return false;
  }

  /** @dev deposit funds to the contract
    */
  function deposit() public payable whenNotPaused {
    addUser(msg.sender);
    depositedBalances[msg.sender] = depositedBalances[msg.sender].add(msg.value);
    emit NotifyDeposit(msg.sender, msg.value, depositedBalances[msg.sender]);
  }

  /** @dev withdrawal funds out of pool
    * @param wdValue amount to withdraw
    */
  function withdraw(uint wdValue) public whenNotPaused {
    require(wdValue > 0);
    require(depositedBalances[msg.sender] >= wdValue);
    uint startBalance = depositedBalances[msg.sender];
    depositedBalances[msg.sender] = depositedBalances[msg.sender].sub(wdValue);
    checkIfUserIsLeaving(msg.sender);

    msg.sender.transfer(wdValue);

    emit NotifyWithdrawal(
      msg.sender,
      startBalance,
      depositedBalances[msg.sender],
      wdValue
    );
  }

  /** @dev if user has no deposit and no staked funds they are leaving the 
    * pool.  Remove them from user list.
    * @param _user address of user to check
    */
  function checkIfUserIsLeaving(address _user) private {
    if (depositedBalances[_user] == 0 && stakedBalances[_user] == 0) {
      removeUser(_user);
    }
  }

  /** @dev user can request to enter next staking period */
  function requestNextStakingPeriod() public whenNotPaused {
    require(depositedBalances[msg.sender] > 0);
    uint amount = depositedBalances[msg.sender];
    depositedBalances[msg.sender] = 0;
    requestStake[msg.sender] = requestStake[msg.sender].add(amount);
    emit NotifyStaked(msg.sender, requestStake[msg.sender], block.number);
  }

  /** @dev user can request to exit at end of current staking period
    * @param amount requested amount to withdraw from staking contract
   */
  function requestExitAtEndOfCurrentStakingPeriod(uint amount) public {
    require(stakedBalances[msg.sender] >= amount);
    requestUnStake[msg.sender] = requestUnStake[msg.sender].add(amount);
    emit NotifyStaked(msg.sender, requestUnStake[msg.sender], block.number);
  }

  /** @dev retreive current state of users funds
    * @return array of values describing the current state of user
   */
  function getState() public view returns (uint[]) {
    uint[] memory state = new uint[](4);
    state[0] = depositedBalances[msg.sender];
    state[1] = requestStake[msg.sender];
    state[2] = requestUnStake[msg.sender];
    state[3] = stakedBalances[msg.sender];
    return state;
  }
}
