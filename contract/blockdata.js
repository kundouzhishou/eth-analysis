const Web3 = require('web3');
const config = require('../config');

// const web3 = new Web3(config.provider_url_truffle_mainnet);
const web3 = new Web3(config.provider_url_server);


// web3.eth.getBlock(11020704).then(console.log);

// '0x4a1e3e3a2aa4aa79a777d0ae3e2c3a6de158226134123f6c14334964c6ec70cf',
// '0xae3b998343418ece279e30ce8bca4efe85541feb9c7da4a4b11be58551283fa3',
// '0x5721977c1389057dc55c0931dcac46746ea48be9d783e02ce7c581a2130784b7',
// '0xc1fa7c9ee6d994403d7bd877270529266e6e3a7167487cf63663625bcf48e47c',

// bancorbondingcurve contract 0x16F6664c16beDE5d70818654dEfef11769D40983

// tx of creating emn

// web3.eth.isSyncing().then(console.log);

const doFind = async() => {
    txData = await web3.eth.getTransaction("0xef1a1f263e2527e5629765cb7e9ad73fbb353b998eb34afc404e636d38be77cb");
    const input = txData['input'];
    console.log(txData);
    console.log(JSON.stringify(input).indexOf("16F6664c16beDE5d70818654dEfef11769D40983".toLowerCase()));
}

doFind();