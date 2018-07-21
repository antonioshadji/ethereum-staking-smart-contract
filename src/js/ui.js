/* global $ */

/* uttily code for all sites */
$('#year').text(new Date().getFullYear())

/* project specific */
$('#i_metamask').on('click', () => {
  window.open('https://metamask.io', 'mm')
})
