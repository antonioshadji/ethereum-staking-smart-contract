/* global $, web3, Web3 */

const App = {

  rpcurl: 'http://127.0.0.1:7545',
  contractAddress: '0xf6bfb9db4cd57b8d1a38dd134827b2da6ea8c5ae',
  web3Provider: null,
  contracts: {},
  activeInstance: null,
  account: null,

  init: function () {
    console.log('App.init')
    App.initWeb3()
  },

  initWeb3: function () {
    // define App.web3Provider
    if (typeof web3 !== 'undefined') {
      if (web3.currentProvider.isMetaMask) {
        console.log('Metamask detected')
      } else {
        console.log('Metamask not detected, found other web3')
      }
      App.web3Provider = web3.currentProvider
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      // TODO: verify correct server for testing
      console.log('create new web3')
      // use 127.0.0.1 is better than localhost (no network access required)
      // https://truffleframework.com/docs/advanced/truffle-with-metamask#using-metamask-with-truffle-develop
      App.web3Provider = new Web3.providers.HttpProvider(App.rpcurl)
      // global assignment on purpose
    }
    // define global web3 with provider
    web3 = new Web3(App.web3Provider) // eslint-disable-line no-global-assign

    App.getActiveAccount()
  },

  getActiveAccount: function () {
    // getAccounts returns a promise -- must use .then to receive result
    // use multiple .then to execute actions in sequence
    // .catch to catch errors
    web3.eth.getAccounts().then((result) => {
      // 'this' is App object same as function getActiveAccount
      console.log('Promise value: ', result)
      App.updateAccount(result[0])
      // this must be here for sequence
    }).catch((reason) => {
      // Log the rejection reason
      console.log('Handle rejected promise (' + reason + ') here.')
    })

    App.initContract()
  },

  updateAccount: function (acct) {
    App.account = acct
    $('#t_account').text(acct)
  },

  initContract: function () {
    $.getJSON('StakePool.json')
      .done(function (data) {
        console.log('DATA: ', data)
        // instantiate new contract
        App.contracts.StakePool = new web3.eth.Contract(
          data.abi,
          App.contractAddress)
        enableSend()
      })
      .fail(function (jqxhr, textStatus, error) {
        var err = textStatus + ', ' + error
        // console.log(jqxhr)
        console.log('Failed to find Smart Contract: ' + err)
        disableSend()
      })
  },

  sendEther: function (value, target) {
    web3.eth.sendTransaction({
      from: App.account,
      to: target,
      value: web3.utils.toWei(value, 'ether')
    }).then((result) => {
      console.log('Promise value: ', result)
    }).catch((reason) => {
      // Log the rejection reason
      console.log('Handle rejected promise (' + reason + ') here.')
    })
  }

}

/* setup related event listeners */
/* b_ => buttons */
$('#b_refresh').on('click', () => {
  App.getActiveAccount()
})

$('#b_trx').on('click', () => {
  // App.sendEther('1', '0x5755B9Bf6bf9d4bE8Bb36eCC8D212a3C329899ab')
  console.log('click#b_trx')
  // default account is null
  // console.log(web3.eth.defaultAccount)
  App.contracts.StakePool.methods.deposit()
    .send({from: App.account, value: web3.utils.toWei('1', 'ether')})
    .on('transactionHash', (hash) => {
      console.log('trx_Hash: ', hash)
    })
    .on('confirmation', (confirmationNumber, receipt) => {
      // output 24 confirmations ??
      console.log('Conf: ', confirmationNumber)
      console.log('receipt: ', receipt)
    })
    .on('receipt', (receipt) => {
      console.log('Receipt: ', receipt)
    })
    .on('error', console.error)
})

function disableSend () {
  $('#b_trx').prop('disabled', true)
}
function enableSend () {
  $('#b_trx').prop('disabled', true)
}
