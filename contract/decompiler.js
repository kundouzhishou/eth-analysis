const { parseCode } = require("@truffle/code-utils");
 
const contractHexCode = "0x608060405234801561001057600080fd5b50600436106100575760003560e01c806318b0c3fd1461005c5780633a3c3b87146100665780637cf5dab01461009a5780638381f58a146100c8578063d826f88f146100e6575b600080fd5b6100646100f0565b005b61006e6100fe565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100c6600480360360208110156100b057600080fd5b8101908080359060200190929190505050610116565b005b6100d0610124565b6040518082815260200191505060405180910390f35b6100ee61012a565b005b600160005401600081905550565b7316f6664c16bede5d70818654defef11769d4098381565b806000540160008190555050565b60005481565b6000808190555056fea264697066735822122028d923f87050d6b7efac3f6a61a052b32b81e495b6eab53ba0be5384eb6038b664736f6c63430007010033";
 
const parsedCode = parseCode(contractHexCode);
// console.log(JSON.stringify(parsedCode));
console.log(JSON.stringify(parsedCode).indexOf("0x16F6664c16beDE5d70818654dEfef11769D40983".toLowerCase()));