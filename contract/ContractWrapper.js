const Web3 = require('web3');
const {Compiler} = require('./Compiler');
const config = require('../config');

// Initialization
const privKey = config.eth_account.private_key;
const address = config.eth_account.address;

class ContractWrapper {
    constructor(dir,provider,localContractName,deployedContractAddress) {
        this.web3 = new Web3(provider);
        this.web3.eth.handleRevert = true;
        const abi = new Compiler(dir,localContractName).compile().abi;
        this.contract = new this.web3.eth.Contract(abi, deployedContractAddress);
    }

    async callFunction(funcName,gasPrice,gasLimit,value,args) {
        console.log(`Calling the [ ${funcName} ] function in contract at address ${this.contract.options.address}`);
        const createTransaction = await this.web3.eth.accounts.signTransaction({
            from: address,
            to: this.contract.options.address,
            data: this.contract.methods[funcName](...args).encodeABI(),
            gasLimit: this.web3.utils.toHex(gasLimit), 
            gasPrice: this.web3.utils.toHex(this.web3.utils.toWei(gasPrice,'gwei')),
            value: this.web3.utils.toHex(this.web3.utils.toWei(value,'ether'))
        },privKey);
    
        this.web3.eth.sendSignedTransaction(createTransaction.rawTransaction)
        .once('receipt', receipt => {
            console.log(`successd! hash:${receipt['transactionHash']} gasUsed:${receipt['gasUsed']}`);
        }).on('error', error => {
            console.log(`failed! reason:${error['reason']}`);
        }).on("confirmation",(confNumber,receipt) => {
            if (confNumber > 0) 
                console.log(`${confNumber} confirmation`);
        });
    }

    async callConstantMethod(funcName,args) {
        const res = await this.contract.methods[funcName](...args).call();
        console.log(res);
    }
}

let wrapper = new ContractWrapper(__dirname + "/interact_example/",config.provider_url_truffle_rinkeby,"CounterFactory","0x479CEc829a648d5501AB17C05E8FF923D9Ac8BcE");
// wrapper.callFunction("increment",'28',630000,'0',[]);
wrapper.callFunction("getMyCount",'28',630000,'0',[]);
// wrapper.callFunction("getCount",'28',630000,'0',['0x8a6b9dd334940D673fC549008661c2A04770328a']);
// wrapper.callFunction("changeOwner",'28',630000,'0',['0x479CEc829a648d5501AB17C05E8FF923D9Ac8BcE']);
// wrapper.callConstantMethod("getMyCount",[]);
