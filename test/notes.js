
// this is sample code
// function testSendEther(value, target, account) {
//   web3.eth.sendTransaction({
//     from: account,
//     to: target,
//     value: web3.toWei(value, 'ether')
//   }, (err, result)  {
//     if (err) {
//       console.log('Error: ', err)
//     } else {
//       console.log('Success: ', result)
//     }
//   })
// }
//
// this is what a transactionObject looks like
// { tx: '0xf62b031a27ac9a460572a470447f6b396ea4b8fbc57c67ee1d6b3244ad32377a',
//   receipt:
//    { transactionHash: '0xf62b031a27ac9a460572a470447f6b396ea4b8fbc57c67ee1d6b3244ad32377a',
//      transactionIndex: 0,
//      blockHash: '0x24bba9d5410a0260ddfca23f002729794e6b8d18ff8ba36afe33fe6822c93bfa',
//      blockNumber: 105,
//      gasUsed: 43670,
//      cumulativeGasUsed: 43670,
//      contractAddress: null,
//      logs: [ [Object] ],
//      status: '0x1',
//      logsBloom: '0x00000400000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000' },
//   logs:
//    [ { logIndex: 0,
//        transactionIndex: 0,
//        transactionHash: '0xf62b031a27ac9a460572a470447f6b396ea4b8fbc57c67ee1d6b3244ad32377a',
//        blockHash: '0x24bba9d5410a0260ddfca23f002729794e6b8d18ff8ba36afe33fe6822c93bfa',
//        blockNumber: 105,
//        address: '0x9dd702718d749a17df476eafe1c3d69be2c99839',
//        type: 'mined',
//        event: 'NotifyDeposit',
//        args: [Object] } ] }
