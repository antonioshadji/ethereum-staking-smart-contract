# Staking Pool Smart Contract.
In the near future, it is expected that Ethereum will move to a Proof of Stake model.  The details are uncertain, but it is likely that there may be an opportunity to organize a staking pool as a business opportunity.  
This contract is designed to be a framework for staking ether as a group.  Since details are few at this time, I have created a dummy contract that will act as the staking contract.  The staking pool contract will manage users deposits and distribution of profits.

## Users functions
[x] User must be able to deposit ether
[ ] User must be able to stake deposited ether
[ ] User must be able to UN-stake ether
[x] User must be able to withdraw unstaked ether
[x] User must be able to see deposited ether balance on GUI
[ ] User must be able to see staked ether as separate value on GUI
[ ] User profits will accumulate in deposited ether balance

## Owner functions
[x] Owner must be able to set the address of the staking contract
[ ] Owner must be able to collect a fee for running the staking pool.
[ ] Owner must NOT be able to remove more ether than fee
[ ] Owner must be able to trigger a profit distribution

## Contract functions
[ ] Must be able to receive funds from staking pool
[x] Must track users deposits by address
[ ] Must track users staked deposits by address
[ ] Must calculate profit share for each user

### Profit share calculation
Owner fee shall be 1%
User Profit will be 99% of profits received * User % of pool.

Every stake/unstake operation will modify the total staked value such that contract always maintains correct balance that is the total staked balance.

Owner will trigger profit distribution.
Users will get profits based on their total deposit and time deposited.
Time will be tracked in Ethereum blocks.  If a user stakes 1 ether at block 7,000,000 and unstakes 1 ether at block 7,000,100.  they will have accumulated 100 * 1 = 100 time units.
this value will be calculated for each address that is staking ether.
this value times the sum of all values will be the users %.  This percentage will be multiplied by 99% of the profit to be distributed and Owner receives 1% of profit off the top.




## Notes
`truffle migrate --reset`
- clears contract artifacts and creates new contract.
- must be used when starting development after having migrated on previous day.  ganache starts clean.
- contract will be created with same address
- scripted as npm run migrate

2018-08-07 19:37:10 -0400 
next action: run test as `truffle test test/StakePool.js`
current test is working.  write up more tests


