/* global artifacts */
var StakePool = artifacts.require('StakePool')

module.exports = function (deployer) {
  deployer.deploy(StakePool)
}
