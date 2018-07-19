/* global $, web3, Web3 */

const App = {

  web3Provider: null,
  contracts: {},
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
        console.log('found web3')
      }
      App.web3Provider = web3.currentProvider
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      // TODO: verify correct server for testing
      console.log('create web3')
      // use 127.0.0.1 is better than localhost (no network access required)
      // https://truffleframework.com/docs/advanced/truffle-with-metamask#using-metamask-with-truffle-develop
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545')
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
      App.account = result[0]
      $('h1').first().text('Hello Ethereum: ' + App.account)
    }).catch((reason) => {
      // Log the rejection reason
      console.log('Handle rejected promise (' + reason + ') here.')
    })
  }

}

// window waits for everything to load, not just DOM
// $( window ).on( 'load', readyFn )
// Shorthand for $( document ).ready()
$(function () {
  console.log('$ ready!')
  App.init()
})
