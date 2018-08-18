/* global $, App */

const Srv = {

  web3Provider: null,
  intervalID: null,

  startTimerNow: function () {
    Srv.intervalID = window.setInterval(Srv.stakePeriod, 5000)
  },

  stakePeriod: function () {
    // actions
    console.log('timer callback')

    if ($('#s_req_stake').text() > 0) {
      console.log('call testOwnerStake')
      console.log(Srv)
      Srv.testOwnerStake()
    }
    if ($('#s_req_unstake').text() > 0) {
      Srv.testOwnerUnStake()
    }
  },

  stopTimerNow: function () {
    clearInterval(Srv.intervalID)
  },

  testOwnerStake: function () {
    App.contracts.StakePool.deployed().then(function (instance) {
      return instance.stake()
    }).then(function (trxObj) {
      console.log(trxObj)
    }).catch(function (err) {
      console.error(err)
    })
  },

  testOwnerUnStake: function () {
    App.contracts.StakePool.deployed().then(function (instance) {
      // TODO: hard coded gas
      return instance.unstake({gas: 100000})
    }).then(function (trxObj) {
      console.log(trxObj)
    }).catch(function (err) {
      console.error(err)
    })
  }
}

// this isn't working as planned, it pops up a confirm from Metamask
// TODO: add new web3 to not use Metamask
// Srv.startTimerNow()
