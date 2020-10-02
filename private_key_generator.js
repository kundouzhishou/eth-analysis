const keythereum = require("keythereum");
const datadir = "";
const address= "";
const password = "";

const keyObject = keythereum.importFromFile(address, datadir);
const privateKey = keythereum.recover(password, keyObject);
console.log(privateKey.toString('hex'));