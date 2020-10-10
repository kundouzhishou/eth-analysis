var request = require('request');
config = require("./config");
const Web3 = require('web3');
var web3 = new Web3(config.provider_url_local);
const util = require("util")

const NOTIFY_URL = 'http://miaotixing.com/trigger';

const ID_DOMAINM = config.miaotixing.id_bancor_bonding_curve;

const CONTRACT_LIST = [
    // bancor bonding curve
    '16F6664c16beDE5d70818654dEfef11769D40983'
]

let NOTIFY_TAG = true;
var lastScanedBlockId = 0;

async function scanAllBlock() {
    // don't notify
    NOTIFY_TAG = false;

    const data = await web3.eth.isSyncing();
    // console.log(data);
    console.log(util.format(`currentBlock: ${data["currentBlock"]}, highestBlock: ${data["highestBlock"]}, left: ${data["highestBlock"] - data["currentBlock"]}`));
    const currentBlock = data["currentBlock"];
    // const startingBlock = data["startingBlock"];

    const startingBlock = 10950651 - 1;
    // const currentBlock = 10950651;

    for(i = startingBlock + 1; i <= currentBlock; i++) {
        if(i % 10000 == 0)
            console.log("scan block " + i);
        scanBlock(i);
        await new Promise(resolve => setTimeout(resolve, 0.1*1000));
    }

    console.log("all block scaned ...");
}

async function scanBlock(blockId) {
    // console.log("scan block:" + blockId);
    const blockData = await web3.eth.getBlock(blockId);
    const transactionsData = blockData["transactions"];
    for(j = 0; j < transactionsData.length; j++) {
        scanTx(transactionsData[j]);
        await new Promise(resolve => setTimeout(resolve,0.01*1000));
    }
}

async function scanTx(txId) {
    // console.log("scan txid:" + txId);
    const txData = await web3.eth.getTransaction(txId);
    const input = txData['input'];
    if(checkInput(input)) {
        console.log("yes ==> " + txId);
        if(NOTIFY_TAG) {
            doNotify("txid : " + txId);
        }
    }
    // console.log("over: " + txId);
}

function checkInput(input) {
    for(i = 0; i < CONTRACT_LIST.length; i++) {
        if(JSON.stringify(input).indexOf(CONTRACT_LIST[i].toLowerCase()) != -1) {
            return true;
        }
    }
    return false;
}

async function tick() {
    const data = await web3.eth.isSyncing();
    const currentBlock = data["currentBlock"];

    if(currentBlock % 100 == 0)
        console.log(util.format(`currentBlock: ${data["currentBlock"]}, highestBlock: ${data["highestBlock"]}, left: ${data["highestBlock"] - data["currentBlock"]}`));
    
    if(lastScanedBlockId == 0) {
        lastScanedBlockId = currentBlock;
    }else if (lastScanedBlockId < currentBlock){
        lastScanedBlockId = lastScanedBlockId + 1;
    }else {
        // do nothing
        return;
    }
    console.log("start scan :", lastScanedBlockId);

    scanBlock(lastScanedBlockId);
}

function doNotify(str) {
    console.log(new Date(),"notify : ", str);
    request.post(NOTIFY_URL,{ json: {id: ID_DOMAINM,text: str} }, function(error,response,body) {
        if (!error && response.statusCode == 200) {
            console.log(new Date(),body);
        }
    });
}

async function run() {
    while(true) {
        tick();
        // console.log("sleep secs ...");
        await new Promise(resolve => setTimeout(resolve, 5*1000));
    }
}

console.log(new Date(),"start BancorBondingCurve notify service ...");
console.log("now:" + (Math.floor(new Date().getTime() / 1000) - 300));

// scanAllBlock();

run();
// scanBlock(11021874);
// scanTx("0xef1a1f263e2527e5629765cb7e9ad73fbb353b998eb34afc404e636d38be77cb");
// tick();

// console.log("done ...");
