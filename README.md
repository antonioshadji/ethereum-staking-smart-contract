# Staking Pool Smart Contract.

See the [front end hosted on github][3] This will connect to an instance of Ganache running on localhost at port 8545.

You can also see the front end via [IPFS](https://gateway.ipfs.io/ipfs/QmQanC6PBfZxshSMeViJpozNfdG1RUBEoKWocv6aVeq9w5/). To connect to the IPFS version ganache must be running on port 7545

Table of Contents:
* [Overview](#overview)
* [Major functions](#users-functions)
* [Staking Period](#staking-period)
* [Profit Distribution](#profit-share-calculation)
* [How to test the StakePool](#how-to-test-the-stakepool)
* [Automated Testing](#automated-testing)


## Overview
In the near future, it is expected that Ethereum will move to a Proof of Stake model.  The details are uncertain as to how the process will work.  This staking pool contract is designed to be quickly adapted and launched when the time is right.  It may also serve as a basis for token staking contract such as OMG which is expected to launch a second layer network on top of ethereum.

The StakePool contract is designed to be a framework for staking ether as a group.  Since details are few at this time, I have created a dummy contract that will act as the staking contract.  The staking pool contract will manage users deposits and distribution of profits.

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
In actual practice the staking period will be set at 24 hours to start.  In this code the staking period is set at 12 seconds for demo purposes.  In addition, to simulate staking earnings, a server process is setup to deposit 0.01 ether into the mock staking contract.  These deposits are taken as the income to be distributed to all the users participating in the pool.  

### Profit share calculation
Owner fee shall be 1%
User Profit will be 99% of profits received times the user's percentage of the total pool.

Every stake/unstake operation will modify the total staked value such that contract always maintains correct balance for the total staked balance.

In production, the owner will trigger profit distribution on a daily basis. 

## How to test the StakePool
1. Git clone the repository to your local machine.
`git clone https://github.com/AntoniosHadji/ethereum-staking-smart-contract.git`
2. Change to the project directory.
2. Run 'npm install' to update the dependencies.  
3. Start Ganache on the local machine.  
4. Run `npm run migrate` to execute the migration script.  In addition to running `truffle migrate`, this script will copy the smart contract JSON to the `src` directory where the front end is expecting it.  
4. Run `npm run server` to start the development server.  
5. Visit `http://localhost:8000` to see the application.
6. If you are already logged into Metamask, the Dapp will pick up your active account and display it in the upper right corner.  If not, login to Metamask and press the Refresh button in the top right corner.
7. Now the application is ready to use.  Users may:
    1. Deposit or withdraw ether.
    2. Request deposited ether be staked.
    3. Request staked ether be unstaked.
    4. View accumulated earnings on any staked ether.

In this test setup, the application is running both the client side code and server side code in the browser.  In production, the server side code would be run from a server controlled by the pool owner, while the client side code can be run from any service that supports html/javascript web apps.

### Automated Testing
Automated tests can be run with `npm test` command.

File [./test/full-workflow.js][1] runs the contract through the full application lifecycle.  
The overall goal in writing these tests was to test each smart contract function in the context in which the front end Dapp will be interacting with the smart contract.  These tests are specifically designed to test the smart contract.  Not the front end code.  For a production application, tests would be conducted using the front end code in addition to web3 direct manipulation.  

1. Verify that both StakePool and StakeContract are starting with 0 ether balance.  
2. Verify that ether can be deposited by multiple users, including owner account (account[0]).  
3. Verify that StakePool correctly recorded deposits for all users.  
4. Compare that total ether balance for StakePool is equal to total deposits.  
5. Verify that each user (including owner account) can request deposited ether to be staked  
6. Verify that contract state shows correct accounting of ether as requested to be staked.  
7. Verify that deposits are set to zero when balance is requested to be staked.  
8. Verify that StakePool can send ether to StakeContract for staking.  
9. Verify that staked balances are recorded correctly.  
1. Verify that StakeContract contains all the ether in this test.  
2. Verify that there is on ether left in StakePool.  
3. Verify that StakePool can calculate a correct profit distribution.  This test takes multiple steps:  
    1. First deposit ether from external account to simulate earnings being created in StakeContract. (mock staking contract/wallet)
    2. Verify that earnings are reported via logs.
    3. Verify that owner's profits are calculated correctly.
    4. Verify that earnings are distributed correctly.  
4. Verify that all accounts can request ether be unstaked.  
5. Verify that all ether is unstaked.  
6. Verify that StakeContract is now empty.  
7. Verify that StakePool contains all expected ether.  
8. Verify that ether can not be withdrawn from by an account who has not deposited ether.
8. Verify that user can not withdraw more than their own balance of ether.
9. Verify that each account can withdraw it's ether balance (including earnings).
0. Verify that after full withdraw, StakePool is empty of ether.  






[1]: https://github.com/AntoniosHadji/ethereum-staking-smart-contract/blob/master/test/full-workflow.js
[2]: https://github.com/AntoniosHadji/ethereum-staking-smart-contract/blob/master/test/server-functions.js
[3]: https://www.hadji.co/ethereum-staking-smart-contract/src/
