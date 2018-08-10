/* global artifacts */
var StakePool = artifacts.require('StakePool')
var StakeContract = artifacts.require('StakeContract')

module.exports = function (deployer) {
  deployer.deploy(StakePool)
  deployer.deploy(StakeContract)
}
