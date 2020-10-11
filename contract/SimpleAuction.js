const Web3 = require('web3');
const {Compiler} = require('./Compiler');
const config = require('../config');

// Initialization
const privKey = config.eth_account.private_key;
const address = config.eth_account.address;

const web3 = new Web3(config.provider_url_truffle_rinkeby);

const compiler = new Compiler(__dirname,"SimpleAuction");
const contractFile = compiler.compile();
// Initialization
const abi = contractFile.abi;

const acutionContractAddress = "0x009FB7144b03E10a19F98B22Ff9fA67743591e22";

// Contract call
const simpleAuction = new web3.eth.Contract(abi, acutionContractAddress);

async function bid(amount) {
    console.log(`Calling the bid function in contract at address ${acutionContractAddress}`);
    const createTransaction = await web3.eth.accounts.signTransaction({
        from: address,
        to: acutionContractAddress,
        data: simpleAuction.methods.bid().encodeABI(),

        gas: web3.utils.toHex(630000), // transfer gas = gasPrice * 21000 gwei
        // gasLimit: web3.utils.toHex(630000),

        gasPrice: web3.utils.toHex(web3.utils.toWei('28','gwei')),
        value: web3.utils.toHex(web3.utils.toWei(amount,'ether'))
    },privKey);

    web3.eth.sendSignedTransaction(createTransaction.rawTransaction).on('receipt', res => {
        console.log('successd:',res);
        console.log('successd:',res['transactionHash']);
    }).on('error', err => {
        console.log('failed:',err);
    });
}

async function getBalance() {
    const balance = await web3.eth.getBalance(address);
    console.log(web3.utils.fromWei(balance,'ether'));
}

async function getGasPrice() {
    const result = await web3.eth.getGasPrice();
    console.log(result);
}

// getBalance();
bid('0.005');
// getGasPrice();
// console.log(web3.utils.toWei('28','gwei'));