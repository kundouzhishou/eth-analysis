var request = require('request');
config = require("./config");
const Web3 = require('web3');
var web3 = new Web3(config.provider_url_server);

var subscription = web3.eth.subscribe('newBlockHeaders', function(error, result){
    if (!error) {
        console.log(result);

        return;
    }

    console.error(error);
})
.on("connected", function(subscriptionId){
    console.log(subscriptionId);
})
.on("data", function(blockHeader){
    console.log(blockHeader);
})
.on("error", console.error);

// unsubscribes the subscription
subscription.unsubscribe(function(error, success){
    if (success) {
        console.log('Successfully unsubscribed!');
    }
});