/* global artifacts */
// https://truffleframework.com/docs/truffle/getting-started/running-migrations#available-accounts

var StakePool = artifacts.require('StakePool')
var StakeContract = artifacts.require('StakeContract')

module.exports = function (deployer, network, accounts) {
  deployer.deploy(StakeContract).then(function (instance) {
    return deployer.deploy(StakePool, instance.address)
  })
}
