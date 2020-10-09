// import EthTx from "ethereumjs-tx";
const Web3 = require('web3')
const config = require("./config")

async function connect() {
    web3 = new Web3(new Web3.providers.HttpProvider(config.provider_url_server));
    console.log("start");
    const networkId = await web3.eth.net.getId();
    console.log(networkId);
    console.log("end");
};

connect();