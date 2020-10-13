const Web3 = require('web3');
const {Compiler} = require('./Compiler');
const config = require('../config');

async function deploy(dir,contractName,args) {
    const compiler = new Compiler(dir, contractName);
    const contractFile = compiler.compile();
    // Initialization
    const bytecode = contractFile.evm.bytecode.object;
    const abi = contractFile.abi;

    const privKey = config.eth_account.private_key;
    const address = config.eth_account.address;

    const web3 = new Web3(config.provider_url_truffle_rinkeby);

    console.log("Attempting to deploy from account", address);
    const incrementer = new web3.eth.Contract(abi);

    const incrementerTx = incrementer.deploy ({
        data: bytecode,
        arguments: args,
    });

    const createTransaction = await web3.eth.accounts.signTransaction(
        {
            from: address,
            data: incrementerTx.encodeABI(),
            gas: web3.utils.toHex(3000000),
        },
        privKey
    );

    const createReceipt = await web3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
    );
    console.log("Contract deployed at address", createReceipt.contractAddress);
}

// deploy(__dirname,"Incrementer", [5]);
// console.log(__dirname + "interact_example/");
deploy(__dirname + "/interact_example/","CounterFactory",[]);