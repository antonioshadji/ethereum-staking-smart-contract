/* global $, web3, Web3, UI, TruffleContract */

/* metamask only supports these methods syncronously
 * eth_accounts (web3.eth.accounts)
 * eth_coinbase (web3.eth.coinbase)
 * eth_uninstallFilter (web3.eth.uninstallFilter)
 * web3.eth.reset (uninstalls all filters).
 * net_version (web3.version.network).
 */

const App = {

  web3Provider: null,
  contracts: {},
  rpcurl: 'http://127.0.0.1:7545',
  network: null,
  events: {},
  account: null,

  init: function () {
    console.log('App.init')
    UI.setup()
    return App.initWeb3()
  },

  initWeb3: function () {
    // define App.web3Provider
    if (typeof web3 !== 'undefined') {
      if (web3.currentProvider.isMetaMask) {
        console.log('Metamask detected')
        App.web3Provider = web3.currentProvider
      } else {
        console.log('Metamask not detected, found other web3')
      }
    } else {
      // If no injected web3 instance is detected, fall back to create web3
      // TODO: verify correct server for testing
      console.log('create new web3')
      // use 127.0.0.1 is better than localhost (no network access required)
      // https://truffleframework.com/docs/advanced/truffle-with-metamask#using-metamask-with-truffle-develop
      App.web3Provider = new Web3.providers.HttpProvider(App.rpcurl)
    }
    // global assignment on purpose
    // define global web3 with provider
    // overwrite web3 with ethereumProvider created with Web3 constructor
    web3 = new Web3(App.web3Provider) // eslint-disable-line no-global-assign
    console.log('web3 version: ', web3.version)
    App.logNetwork()
    console.log(web3.eth.accounts)
    App.updateAccount()
    return App.initContract()
  },

  initContract: function () {
    $.getJSON('./js/StakePool.json', function (data) {
      console.log('Contract Data: ', data)
      // instantiate new contract
      // TODO: update network programattically
      // App.contracts.StakePool = web3.eth.contract(data.abi).at(
      //   data.networks['5777'].address
      // )
      App.contracts.StakePool = TruffleContract(data)
      App.contracts.StakePool.setProvider(App.web3Provider)
    })
      .then(function (data) {
        console.log('getJSON.then')
        console.log('StakePool:\n', App.contracts.StakePool)
        UI.enableElemById('#b_trx')
        App.getBalance()
        // return App.initEvents()
      })
      .fail(function (jqxhr, textStatus, error) {
        let err = textStatus + ', ' + error
        console.log('jQuery jqxhr: ', jqxhr)
        console.log('Failed to find Smart Contract: ' + err)
        UI.disableElemById('#b_trx')
        return error
      })
  },

  //  initEvents: function () {
  //    App.events.Deposit =
  //      App.contracts.StakePool.NotifyDeposit({},
  //        function (error, result) {
  //          if (error) {
  //            console.error('ERROR:\n', error)
  //          } else {
  //            console.log('EVENT:\n', result)
  //            // TODO: this is a better place for update balance than on confirmation
  //          }
  //        }
  //      )
  //  },

  updateAccount: function () {
    App.account = web3.eth.coinbase
    console.log(App.account)
    $('#t_account').text(App.account)
    return App.account
  },

  sendTransaction: function (value) {
    // TODO: value must be <= 18 decimal places -- otherwise fails
    App.contracts.StakePool.deployed().then(function (instance) {
      return instance.deposit(
        {
          from: App.account,
          value: web3.toWei(value, 'ether')
        }
      )
    }).then(function (result) {
      console.log('transaction submitted by user')
      console.log(result)
      let b = web3.fromWei(result.logs[0].args.balance.toNumber(), 'ether')
      $('#s_value').text(b)
    }).catch(function (err) {
      console.log('transaction rejected by user')
      console.log(err.message)
    })

    // App.contracts.StakePool.deposit().sendTransaction(
    //   {
    //     from: App.account,
    //     value: web3.toWei(value, 'ether')
    //   },
    //   function (err, transactionHash) {
    //     if (!err) {
    //       console.log('trx_Hash: ', transactionHash)
    //     } else {
    //       console.error(err)
    //     }
    //   })

    // .on('receipt', (receipt) => {
    //     console.log('Receipt: ', receipt)
    //     console.log('event->amount: ',
    //       receipt.events.NotifyDeposit.returnValues.amount)
    //   })
    //   .on('confirmation', (confirmationNumber, receipt) => {
    //     // TODO: Why output 24 confirmations ??
    //     console.log('Conf: ', confirmationNumber)
    //     console.log('receipt: ', receipt)
    //     // TODO: have App.getBalance callback/promise turn spinner off
    //     if (confirmationNumber === 1 || confirmationNumber === 10) {
    //       UI.toggleHiddenElementById('#spinner')
    //     }

    //     // TODO: first attempt to update balance after transaction
    //     // this can be removed once event is used in receipt
    //     App.getBalance()
    //   })
    //   .on('error', console.error)
    //   .then(function (receipt) {
    //     console.log('Then.Receipt:\n', receipt)
    //     // does not work here
    //     // App.getBalance()
    //   })
  },

  getBalance: function () {
    console.log('Default account: ', web3.eth.defaultAccount)
    console.log('App.account: ', App.account)
    console.log('Default block: ', web3.eth.defaultBlock)

    App.contracts.StakePool.deployed().then(function (instance) {
      return instance.getBalance.call()
    }).then(function (value) {
      console.log('Value: ', value)
      let v = web3.fromWei(value.toNumber(), 'ether')
      console.log('Update Balance: ', v)
      // value is in wei, display in ether
      // TODO: update UI with balance
      $('#s_value').text(v)
    }).catch(function (err) {
      console.error('Rejected balance request: ', err)
    })

    //    App.contracts.StakePool.getBalance().call(
    //      {from: App.account},
    //      function (err, result) {
    //        if (err) {
    //          console.error('Rejected balance request: ', err)
    //        } else {
    //          console.log('Update Balance: ', result)
    //        // value is in wei, display in ether
    //        // TODO: update UI with balance
    //        // $('#s_value').text(web3.utils.fromWei(value, 'ether'))
    //        }
    //      }
    //    )
  },

  logNetwork: function () {
    web3.version.getNetwork((err, netId) => {
      if (err) {
        console.error(err)
        return
      }
      App.network = netId
      switch (netId) {
        case '1':
          console.log('This is mainnet')
          break
        case '2':
          console.log('This is the deprecated Morden test network.')
          break
        case '3':
          console.log('This is the ropsten test network.')
          break
        case '4':
          console.log('This is the Rinkeby test network.')
          break
        case '42':
          console.log('This is the Kovan test network.')
          break
        default:
          console.log('This is an unknown network: ', netId)
      }
    })
    // netId also available with console.log(web3.version.network)
  },

  testSendEther: function (value, target) {
    web3.eth.sendTransaction({
      from: App.account,
      to: target,
      value: web3.toWei(value, 'ether')
    }, (err, result) => {
      if (err) {
        console.log('Error: ', err)
      } else {
        console.log('Success: ', result)
      }
    })
  },

  testEvents: function () {
    // this is App with function
    // this is Window with =>
    //
    // this code only retrieves last event
    App.contracts.StakePool.getPastEvents('allEvents', { from: App.account },
      function (error, events) {
        if (error) console.error('testEvents ERROR: ', error)
        console.log('testEvents: ', events)
      })
  }

}

/* setup related event listeners */
/* b_ => buttons */
$('#b_refresh').on('click', () => {
  App.updateAccount()
})

$('#b_trx').on('click', () => {
  console.log('click#b_trx')
  console.log($('#i_value').val())
  // default account is null
  // console.log(web3.eth.defaultAccount)
  App.sendTransaction($('#i_value').val())
})

$('#b_balance').on('click', () => {
  console.log('click#b_balance')
  App.getBalance()
})

/* test functions */
$('#b_send').on('click', () => {
  console.log('click#b_send')
  App.testSendEther(1, '0xf5cE46d59dbc398d273ab58027D6034A70912184')
})
