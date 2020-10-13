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

async function callFunction(funcName,gasPrice,gasLimit,value,args) {
    console.log(`Calling the bid function in contract at address ${acutionContractAddress}`);
    const createTransaction = await web3.eth.accounts.signTransaction({
        from: address,
        to: acutionContractAddress,
        data: simpleAuction.methods[funcName](...args).encodeABI(),
        gasLimit: web3.utils.toHex(gasLimit), 
        gasPrice: web3.utils.toHex(web3.utils.toWei(gasPrice,'gwei')),
        value: web3.utils.toHex(web3.utils.toWei(value,'ether'))
    },privKey);

    web3.eth.sendSignedTransaction(createTransaction.rawTransaction)
    .once('receipt', receipt => {
        console.log(`successd! hash:${receipt['transactionHash']} gasUsed:${receipt['gasUsed']}`);
    }).on('error', error => {
        console.log('failed:',error);
    }).on("confirmation",(confNumber,receipt) => {
        if (confNumber > 0) 
            console.log(`${confNumber} confirmation`, receipt);
    });
}

async function endAuction() {
    console.log(`Calling the bid function in contract at address ${acutionContractAddress}`);

}

async function estimateGas() {
    web3.eth.estimateGas({
        to: acutionContractAddress,
        data: simpleAuction.methods.bid().encodeABI(),
    })
    .then(console.log);
}

async function getBalance() {
    const balance = await web3.eth.getBalance(address);
    console.log(web3.utils.fromWei(balance,'ether'));
}

async function getGasPrice() {
    const result = await web3.eth.getGasPrice();
    console.log(result);
}

// transfer gas = gasPrice * 21000 gwei

// estimateGas();
// getBalance();
// bid('0.005');
// getGasPrice();
// console.log(web3.utils.toWei('28','gwei'));
callFunction("withdraw", '28', 630000, '0',[]);