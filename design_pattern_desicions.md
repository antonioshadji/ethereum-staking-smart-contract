# Design Patterns

## Circuit Breaker
To implement the circuit breaker, the Open Zeppelin Pausable contract was inherited.  

This allows for the use of the `whenNotPaused` modifier for all user functions.  When the contract is paused only the owner functions are available.  

## Withdraw Pattern
In the `withdraw` function, all data modifications are made before the ether is sent.  If the send was to a contract address, a reentrant call would fail to cause an erroneous transfer because the balance is already reduced by the initial withdraw amount.

# User Management
The design of the user management requires loops of an unknown length array in several `ownerOnly` functions.  This was a deliberate design choice because the math involved.  Calculating the percentage split of the staking profits requires calculations for each user to be executed at the same time.  Users are removed when they no longer have any staked ether to keep the list to a minimum.  Only users with staked funds are added to the `users` array.
