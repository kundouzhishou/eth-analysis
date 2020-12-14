var request = require('request');
config = require("./config");
const util = require("util")
const fetch = require("node-fetch");

const fs = require('fs');

const NOTIFY_URL = 'http://miaotixing.com/trigger';

const ID_DOMAINM = config.miaotixing.id_uniswap;

// var lastPairTime = 1601441127;
// 不知道为何比uniswap的时间快一点
var lastPairTime =  Math.floor(new Date().getTime() / 1000) - 300;

const query_sql = `
{
    pairs (orderBy: createdAtTimestamp where: {createdAtTimestamp_gt:%s} first:10 orderDirection:desc) {
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
        reserve1
        reserveETH
    }
}
`

async function tick() {
    const URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';
    let content = {
        "query": util.format(query_sql,lastPairTime)
    };
    let body = JSON.stringify(content);
    // console.log(body);

    fetch(URL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    }).then(response => response.json()).then(data => {
        // console.log(JSON.stringify(data, null, 4));
        if(data["data"]["errors"]) {
            console.log(new Date(), data["data"]["errors"]);
            return;
        }
        pairs = data["data"]["pairs"];
        let len = pairs.length;
        for(var i = len - 1; i >= 0; i--) {
            let element = pairs[i];
            // console.log(element);
            createdAtTimestamp = parseInt(element["createdAtTimestamp"]);
            
            // 时间从低到高更新
            lastPairTime = createdAtTimestamp;

            token0 = element["token0"];
            token1 = element["token1"];
            reserve0 = parseFloat(element["reserve0"]).toFixed(2);
            reserve1 = parseFloat(element["reserve1"]).toFixed(2);

            if(["WETH","ETH","USDT","UNI","DAI"].indexOf(token0["symbol"]) > -1) {
                targetToken = token1;
                baseToken = token0;
                targetReserve = reserve1;
                baseReserve = reserve0;
            }else {
                targetToken = token0;
                baseToken = token1;
                targetReserve = reserve0;
                baseReserve = reserve1;
            }
            let nameInfo = getGoogleLink(targetToken["name"],`twitter+${targetToken["name"].replace(/ /g,"+")}`) + `(${targetToken["symbol"]})`;
            let address = getUniswapInfoLink(targetToken["id"],targetToken["id"]);
            let reserveETH = parseFloat(element["reserveETH"]).toFixed(2);
            // utc + 8
            let time = new Date(createdAtTimestamp * 1000 + 8*60*60*1000).toLocaleString();
            let msg = `${nameInfo}\n`+ 
                    `[地址]：${address}\n` + 
                    `[流动性]:${reserveETH} ETH\n` + 
                    `[比例]:\n` + 
                    `${targetReserve} ${targetToken["symbol"]}\n` + 
                    `${baseReserve} ${baseToken["symbol"]}\n` + 
                    `[时间]:${time}`;

            let toIgnore = false;
            config.miaotixing.ignore_list.forEach(function(item) {
                if(targetToken["name"].indexOf(item) > -1 || targetToken["symbol"].indexOf(item) > -1) {
                    toIgnore = true;
                }
            });
            if(toIgnore) {
                continue;
            }

            if(reserveETH > 100) {
                doNotify(msg);
                // 每次最多执行一次，多了怕提醒太频繁被拒绝
                break;
            }
        };
    });
}

function getGoogleLink(text,searchContent) {
    return `<a href="https://www.google.com/search?q=${searchContent}">${text}</a>`;
}

function getUniswapInfoLink(text,address) {
    return `<a href="https://uniswap.info/token/${address}">${text}</a>`;
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
        await new Promise(resolve => setTimeout(resolve, 60*1000));
    }
}

console.log(new Date(),"start uniswap notify service ...");
console.log("now:" + (Math.floor(new Date().getTime() / 1000) - 300));

run();
// tick();
// doNotify(`<a href="https://www.google.com/search?q=twitter+Topswap/">test</a>`);
