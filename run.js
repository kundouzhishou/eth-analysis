// import EthTx from "ethereumjs-tx";
const Web3 = require('web3')

async function connect() {
    const url = `http://${config.nginx.name}:${config.nginx.password}@35.225.229.151/rpc`
    web3 = new Web3(new Web3.providers.HttpProvider(url));
    console.log("start");
    const networkId = await web3.eth.net.getId();
    console.log("end");
    console.log(networkId);
};

// connect();