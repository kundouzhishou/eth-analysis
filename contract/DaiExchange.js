const Web3 = require('web3');
const EthTx = require('ethereumjs-tx').Transaction;
const config = require('../config');

const daiExchangeAddress = "0x77dB9C915809e7BE439D2AB21032B1b8B58F6891";

const daiExchangeAbi = require("./abi/rinkeby/dai").abi;

const addressFrom = config.eth_account.address;
const privKey = config.eth_account.private_key;

const web3 = new Web3(new Web3.providers.HttpProvider(config.provider_url_truffle_rinkeby));
const daiExchangeContract = new web3.eth.Contract(JSON.parse(daiExchangeAbi),daiExchangeAddress);
const ETH_SOLD = web3.utils.toHex(5 * 10 ** 16); // 0.05 eth
const MIN_TOKEMS = web3.utils.toHex(0.2 * 10 ** 18); // 0.2 DAI
const DEADLINE = 1601559508;
const exchangeEncodedABI = daiExchangeContract.methods.ethToTokenSwapInput(MIN_TOKEMS,DEADLINE).encodeABI();

function sendSignedTx(txParams, cb) {
    let transaction = new EthTx(txParams,{chain: 'rinkeby'});
    const privateKey = new Buffer.from(privKey,"hex");
    transaction.sign(privateKey);
    const serializedEthTx = transaction.serialize().toString("hex");
    web3.eth.sendSignedTransaction(`0x${serializedEthTx}`,cb);
}

function getBalance() {
    web3.eth.getBalance(addressFrom, function(err, result) {
        if (err) {
            console.log(err)
        } else {
            console.log(web3.utils.fromWei(result, "ether") + " ETH")
        }
    })
}

async function tickTx(txid) {
    let count = 10;
    while(true) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("bn: " + JSON.stringify(web3.eth.getTransaction(txid).blockNumber));
        count --;
        if (count == 0) {
            break;
        }
    }
}

let txParams = {
    gasLimit: web3.utils.toHex(6000000),
    gasPrice: web3.utils.toHex(1000000000),
    from: addressFrom,
    to: daiExchangeAddress,
    data: exchangeEncodedABI,
    value: ETH_SOLD
};

web3.eth.getTransactionCount(addressFrom, 'pending').then(transactionNonce => {
    txParams.nonce = web3.utils.toHex(transactionNonce + 1);
    console.log("tx params:" + JSON.stringify(txParams));
    sendSignedTx(txParams, function(error,txid) {
        if(error) return console.log("error ===> ",error);
        console.log("sent ===> ", txid);

        tickTx(txid);
    });
});