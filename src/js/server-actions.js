/* global $, App */

const Srv = {

  intervalID: null,

  startTimerNow: function () {
    this.intervalID = window.setInterval(this.stakePeriod, 5000)
  },

  stakePeriod: function () {
    // actions
    console.log('timer callback')

    if ($('#s_req_stake').val() > 0) {
      this.testOwnerStake()
    }
    if ($('#s_req_unstake').val() > 0) {
      this.testOwnerUnStake()
    }
  },

  stopTimerNow: function () {
    clearInterval(this.intervalID)
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

Srv.startTimerNow()
