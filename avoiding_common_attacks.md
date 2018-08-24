# Avoiding Common Attacks

## Logic Bugs
Thorough testing of the entire user lifecycle was created to ensure that the staking pool operates as expected.  

## Recursive Calls
The staking pool is designed to work with a single staking contract or staking wallet.  For testing purposes, a mock contract was created.  Before deploying the staking pool contract to interact with a real external contract, it will need to be audited and updated to for that specific external contract.  The staking pool could potentially make two external calls; one to deposit ether to the external contract and one to request a withdraw.  At the time of updating the the staking pool, additional measures can be taken to guard against recursive calls.  First, would be a full audit of the external contracts capabilities.  If necessary, reentrancy can be specifically prevented.

## Integer Arithmetic Overflow
Used safemath library for all math calculations.

## Poison Data
Used require statements to validate user entered data.
* require that 0 address is not passed as stake contract address.  
* require withdraw requester has appropriate balance to withdraw, and that withdraw value is positive number.  
* require that user has a deposited balance before requesting to stake that balance.  
* require that user has sufficient staked balance to cover unstake request.  

## Exposed Functions
Only functions required to be public are made public.
* constructor
* ownerOnly functions
* user deposit, withdraw, request stake, and request unstake

## Exposed Secrets
All data is made private so although it can be seen by anyone inpsecting the blockchain, it can not be used by other contracts.  There is no data that is deemed a secret.

## Timestamp Vulnerabilities
Timestamps are not used.

## Maliscious Admins
Owner only has the ability to:
* Change staking contract / mechanism address
* Withdraw owners profits
* execute stake and unstake functions
