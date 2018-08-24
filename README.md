# Staking Pool Smart Contract.

Table of Contents:
* [Overview](#overview)
* [Users functions](#users-functions)

## Overview
In the near future, it is expected that Ethereum will move to a Proof of Stake model.  The details are uncertain as to how the process will work.  This staking pool contract is designed to be quickly adapted and launched when the time is right.  It may also serve as a basis for token staking contract such as OMG which is expected to launch a second layer network on top of ethereum.

This contract is designed to be a framework for staking ether as a group.  Since details are few at this time, I have created a dummy contract that will act as the staking contract.  The staking pool contract will manage users deposits and distribution of profits.

There is also a mock StakeContract designed to simulate the operation of the staking mechanism.  This is not meant to be functional except for testing the StakePool contract.

## Users functions
[x] User must be able to deposit ether  
[x] User must be able to stake deposited ether  
[x] User must be able to UN-stake ether  
[x] User must be able to withdraw unstaked ether  
[x] User must be able to see deposited ether balance on GUI  
[x] User must be able to see staked ether as separate value on GUI  
[x] User profits will accumulate in staked ether balance  

## Owner functions
[x] Owner must be able to set the address of the staking contract.  
[x] Owner must be able to collect a fee for running the staking pool.  
[x] Owner must NOT be able to remove more ether than fee.  
[x] Owner must be able to trigger a profit distribution.  

## Contract functions
[x] Must be able to receive funds from staking pool  
[x] Must track users deposits by address  
[x] Must track users staked deposits by address  
[x] Must calculate profit share for each user  

## Staking Period
In actual practice the staking period will be set at 24 hours to start.  In this code the staking period is set at 6 seconds for demo purposes.  In addition, to simulate staking earnings, a server process is setup to deposit 0.01 ether into the mock staking contract.  These deposits are taken as the income to be distributed to all the users participating in the pool.  

### Profit share calculation
Owner fee shall be 1%
User Profit will be 99% of profits received * User % of pool.

Every stake/unstake operation will modify the total staked value such that contract always maintains correct balance that is the total staked balance.

Owner will trigger profit distribution.  
the formula is:  
user's share = earnings * 99% * (users stake) / ( total stake)

## How to test the StakePool
1. git clone the repository to your local machine.
`git clone https://github.com/AntoniosHadji/ethereum-staking-smart-contract.git`
2. change to the project directory.
3. Start Ganache on the local machine.  
4. run `npm run migrate` to execute the migration script.  
4. run `npm run server` to start the development server.  
5. visit `http://localhost:8000` to see the application.
6. If you are already logged into Metamask, the Dapp will pick up your active account and display it in the upper right corner.  If not, login to Metamask and press the Refresh button in the top right corner.
7. Now the application is ready to use.  Users may:
    1. deposit or withdraw ether.
    2. request deposited ether be staked.
    3. request staked ether be unstaked.
    4. view accumulated earnings on any staked ether.

### Automated Testing
Automated tests can be run with `npm test` command.

File ./test/full-workflow.js runs the contract through the full lifecycle of a user experience.  
