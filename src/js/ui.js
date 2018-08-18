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

  setBalances: function (arr) {
    $('#s_value').text(arr[0])
    $('#s_req_stake').text(arr[1])
    $('#s_req_unstake').text(arr[2])
    $('#s_staked').text(arr[3])
  },

  setup: function () {
    /* uttily code for all sites */
    $('#year').text(new Date().getFullYear())

    /* project specific */
    $('#i_metamask').on('click', () => {
      window.open('https://metamask.io', 'mm')
    })

    $('#b_max').on('click', () => {
      console.log('click max withdraw')
      $('#i_withdrawal').val(new web3.BigNumber($('#s_value').text()).toNumber())
    })

    $('#b_max_stake').on('click', () => {
      console.log('click max stake')
      $('#i_stake').val(new web3.BigNumber($('#s_value').text()).toNumber())
    })

    $('#b_max_ustake').on('click', () => {
      console.log('click max unstake')
      console.log($('#s_staked').text())
      $('#i_ustake').val($('#s_staked').text())
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
      App.depositFunds($('#i_value').val())
      $('#i_value').val('')
    })

    $('#b_withdrawal').on('click', () => {
      console.log('click#b_withdrawal')
      console.log($('#i_withdrawal').val())
      // default account is null
      // console.log(web3.eth.defaultAccount)
      App.withdrawFunds($('#i_withdrawal').val())
      $('#i_withdrawal').val('')
    })

    $('#b_stake').on('click', () => {
      console.log('click b_stake')
      App.requestStake()
      $('#i_stake').val('')
    })

    $('#b_ustake').on('click', () => {
      console.log('click b_ustake')
      App.requestUnStake($('#i_ustake').val())
      $('#i_ustake').val('')
    })

    // browser test page only available on test server
    if (window.location.hostname === 'localhost') {
      $('#navbarsExampleDefault ul').append('<li class="nav-item"><a class="nav-link" href="/browser.test.html">Test</a></li>')
    }
    /* test functions */
    // $('#b_balance').on('click', () => {
    //   console.log('click#b_balance')
    //   App.getBalance()
    // })

    // $('#b_send').on('click', () => {
    //   console.log('click#b_send')
    //   App.testSendEther(1, '0xf5cE46d59dbc398d273ab58027D6034A70912184')
    // })
  }
}
