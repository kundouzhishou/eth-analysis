config = require("./config");
const UNISWAP = require('@uniswap/sdk')
const Web3 = require('web3')
const fetch = require("node-fetch");

async function connect() {
    const url = `http://${config.nginx.name}:${config.nginx.password}@35.225.229.151/rpc`
    web3 = new Web3(new Web3.providers.HttpProvider(url));
    console.log("start");
    const networkId = await web3.eth.net.getId();
    console.log("end");
    console.log(networkId);
};

async function uniswap() {
    // console.log(`The chainId of mainnet is ${UNISWAP.ChainId.MAINNET}.`)
    const URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';
    let content = {
        "query": query_sql
    };
    let body = JSON.stringify(content);
    fetch(URL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    }).then(response => response.json()).then(data => {
        console.log(JSON.stringify(data, null, 4));
        // console.log(data);
    });
}

const query_sql = `
{
    pairs (orderBy: createdAtTimestamp where: {createdAtTimestamp_gt:1601441127} first:10 orderDirection:asc) {
        token0 {
            id
            name
            symbol
        }
        token1 {
            id
            name
            symbol
        }
        createdAtTimestamp
        txCount
        reserve0
        reserveETH
    }
}
`

// connect();
uniswap();