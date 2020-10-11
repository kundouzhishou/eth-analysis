const Web3 = require('web3');
const {Compiler} = require('./Compiler');
const config = require('../config');

//Deploy contract

// Attempting to deploy from account 0x8a6b9dd334940D673fC549008661c2A04770328a
// Contract deployed at address 0xc37bC4999DfD35eEaC279fe14D3386f54d0ca109

// Attempting to deploy from account 0x8a6b9dd334940D673fC549008661c2A04770328a
// Contract deployed at address 0xe1D740183B5f8E9C49278A5EB3d8559baf55b089

// Attempting to deploy from account 0x8a6b9dd334940D673fC549008661c2A04770328a
// Contract deployed at address 0x7AE56A6Bc0444AdF05540B8de644abA35Cc5a919

// Attempting to deploy from account 0x8a6b9dd334940D673fC549008661c2A04770328a
// Contract deployed at address 0x5De0A94B49607EC02E0Ece5473a64C5f7F7f43ef

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
deploy(__dirname,"SimpleAuction",[100*60,config.eth_account.address]);