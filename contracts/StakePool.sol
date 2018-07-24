pragma solidity ^0.4.24;

/* @title Staking Pool Contract */
contract StakePool {

  // track balances of ether deposited to contract
  mapping(address => uint) poolBalances;

  /** @dev creates contract
    */
  constructor() public { }

  /** @dev deposit funds to the contract
    */
   function deposit() public payable {
     poolBalances[msg.sender] += msg.value;
   }

   /** @dev withdrawal funds out of pool
     *
     */
    function withdrawal() public payable returns (bool) {
     if (poolBalances[msg.sender] >= msg.value) {
       if (!msg.sender.send(msg.value)) {
         return false;
       }
     }
     return true;
    }

    /** @dev retreive balance from contract
      * @return uint current value of deposit
      */
    function getBalance() public view returns (uint) {
      return poolBalances[msg.sender];
    }
}


  /* example comments for functions */
    /** @dev Calculates a rectangle's surface and perimeter.
      * @param w Width of the rectangle.
      * @param h Height of the rectangle.
      * @return s The calculated surface.
      * @return p The calculated perimeter.
      */
