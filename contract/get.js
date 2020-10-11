const Web3 = require('web3');
const {Compiler} = require('./Compiler');
const config = require('../config');

const compiler = new Compiler(__dirname,"Incrementer");
const contractFile = compiler.compile();
// Initialization
const abi = contractFile.abi;

// Initialization
const privKey = config.eth_account.private_key;
const address = config.eth_account.address;

const web3 = new Web3(config.provider_url_truffle_rinkeby);
const contractAddress = '0x7AE56A6Bc0444AdF05540B8de644abA35Cc5a919';

// Contract call
const incrementer = new web3.eth.Contract(abi, contractAddress);

async function get() {
    console.log(`Making a call to contract at address ${contractAddress}`);
    const data = await incrementer.methods
        .number()
        .call();
    console.log(`The current number stored is: ${data}`);
}

async function increment(_value) {
    console.log(`Calling the increment by ${_value} function in contract at address ${contractAddress}`);
    const createTransaction = await web3.eth.accounts.signTransaction({
        from: address,
        to: contractAddress,
        data: incrementer.methods.increment(_value).encodeABI(),
        gas: web3.utils.toHex(210000),
    },privKey);

    const createReceipt = await web3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
    );
    console.log(`Tx successful with hash: ${createReceipt.transactionHash}`);
}

async function bid(amount) {
    acutionContractAddress = "0xbD88B05BC0943d0aECBbadc79Dc607633a6B8F5B";
    console.log(`Calling the bid function in contract at address ${acutionContractAddress}`);
    const createTransaction = await web3.eth.accounts.signTransaction({
        from: address,
        to: acutionContractAddress,
        data: incrementer.methods.bid().encodeABI(),
        gas: web3.utils.toHex(210000),
    },privKey);

    const createReceipt = await web3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
    );
    console.log(`Tx successful with hash: ${createReceipt.transactionHash}`);
}

get();
// increment(10);