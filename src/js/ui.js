/* global $ */
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
  }

}
