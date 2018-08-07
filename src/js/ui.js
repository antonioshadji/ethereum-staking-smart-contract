/* global $ , App, web3 */
/* eslint no-unused-vars: off */

/* UI functions toolbox */
const UI = {
  toggleHiddenById: function (id) {
    $(id).toggleClass('d-none')
  },

  disableElemById: function (id) {
    $(id).prop('disabled', true)
  },

  enableElemById: function (id) {
    $(id).prop('disabled', false)
  },

  setup: function () {
    /* uttily code for all sites */
    $('#year').text(new Date().getFullYear())

    /* project specific */
    $('#i_metamask').on('click', () => {
      window.open('https://metamask.io', 'mm')
    })

    $('#b_max').on('click', () => {
      console.log('click')
      $('#i_withdrawal').val(new web3.BigNumber($('#s_value').text()).toNumber())
    })

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

    $('#b_withdrawal').on('click', () => {
      console.log('click#b_withdrawal')
      console.log($('#i_withdrawal').val())
      // default account is null
      // console.log(web3.eth.defaultAccount)
      App.makeWithdrawal($('#i_withdrawal').val())
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
  }
}
