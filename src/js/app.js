const App = {

  web3Provider: null,
  contracts: {},
  account: null,

  init: function () {
    console.log('build page')
    App.initWeb3()
  },

  initWeb3: function () {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      // TODO: verify correct server for testing
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    }
    web3 = new Web3(App.web3Provider)
    App.getAccountWeb3().then(() => {
      console.log(App.account)
      console.log($('h1').first().text())
      $('h1').first().text('Hello Ethereum: ' + App.account)
    })
  },

  getAccountWeb3: function () {
    // returns a promise -- must use .then to receive result
    let result = web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error)
      } else {
        console.log(accounts)
        console.log(accounts[0])
      }
      // TODO: not a pure function
      App.account = accounts[0];
    })
    return result
  }

}

// window waits for everything to load, not just DOM
// $( window ).on( 'load', readyFn )
// Shorthand for $( document ).ready()
$(function() {
  console.log('ready!')
  App.init()
})
