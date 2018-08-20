/* global $, Web3, TruffleContract  */

const Srv = {

  web3Provider: null,
  intervalID: null,
  contracts: {},
  web3: null,

  init: function () {
    console.log('server init')
    Srv.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545')
    Srv.web3 = new Web3(Srv.web3Provider)
    Srv.initContract('StakePool')
    Srv.startTimerNow()
  },

  initContract: function (name) {
    $.getJSON(`./js/${name}.json`, function (data) {
      // instantiate new contract
      Srv.contracts[name] = TruffleContract(data)
      Srv.contracts[name].setProvider(Srv.web3Provider)
    })
      .then(function (data) {
        console.log(`getJSON.then: ${name}`)
      })
      .fail(function (jqxhr, textStatus, error) {
        let err = textStatus + ', ' + error
        console.log('jQuery jqxhr: ', jqxhr)
        console.log('Failed to find Smart Contract:\n' + err)
        return error
      })
  },

  startTimerNow: function () {
    Srv.intervalID = window.setInterval(Srv.stakePeriod, 5000)
  },

  stakePeriod: function () {
    // actions
    console.log('stake period transition (demo timer callback)')

    if ($('#s_req_stake').text() > 0) {
      console.log('call testOwnerStake')
      Srv.testOwnerStake()
    }
    if ($('#s_req_unstake').text() > 0) {
      console.log('call testOwnerUnStake')
      Srv.testOwnerUnStake()
    }
  },

  stopTimerNow: function () {
    clearInterval(Srv.intervalID)
  },

  testOwnerStake: function () {
    Srv.contracts.StakePool.deployed().then(function (instance) {
      // TODO: hard coded gas
      return instance.stake({gas: 200000})
    }).then(function (trxObj) {
      console.log(trxObj)
      return Srv.getState()
    }).catch(function (err) {
      console.error(err)
    })
  },

  testOwnerUnStake: function () {
    Srv.contracts.StakePool.deployed().then(function (instance) {
      // TODO: hard coded gas
      return instance.unstake({gas: 200000})
    }).then(function (trxObj) {
      console.log(trxObj)
      return Srv.getState()
    }).catch(function (err) {
      console.error(err)
    })
  },

  testSendEthertoStakePool: function () {
    return Srv.contracts.StakePool.deployed().then(function (instance) {
      return Srv.web3.eth.sendTransaction(
        {
          // accounts[9]
          from: '0xc919095E96bb2D986346b8883eEA66Bb5208416c',
          to: instance.address,
          value: Srv.web3.toWei(0.1, 'ether')
        }
      )
    }).then(function (trxObj) {
      console.log(trxObj)
    })
  },

  getState: function () {
    Srv.contracts.StakePool.deployed().then(function (instance) {
      // why returning MetaMask - RPC Error: Internal JSON-RPC error. 32603?
      // contract function was compiling, not working properly ??(guess)
      return instance.getState.call({from: Srv.account})
    }).then(function (stateArr) {
      console.log(`getState: ${stateArr}`)
      Srv.processStateUpdate(stateArr)
      return stateArr
    }).catch(function (err) {
      console.error(`State update error: ${err.message}`)
    })
  },

  processStateUpdate: function (stateArr) {
    $('#s_value').text(Srv.web3.fromWei(stateArr[0], 'ether'))
    $('#s_req_stake').text(Srv.web3.fromWei(stateArr[1], 'ether'))
    $('#s_req_unstake').text(Srv.web3.fromWei(stateArr[2], 'ether'))
    $('#s_staked').text(Srv.web3.fromWei(stateArr[3], 'ether'))
  }
}
