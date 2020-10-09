const path = require('path');
const fs = require('fs');
const solc = require('solc');
const util = require("util")

class Compiler {
   constructor(contractDir, contractName) {
      this.contractName = contractName;
      this.contractDir = contractDir;
   }

   compile() {
      let input = {
         language: 'Solidity',
         sources: {
         },
         settings: {
            outputSelection: {
               '*': {
                  '*': ['*'],
               },
            },
         },
      };
      const fileName = this.contractName + '.sol';
      const fileContent = fs.readFileSync(path.resolve(this.contractDir,fileName), 'utf8');
      input["sources"][fileName] = {content: fileContent};

      const compileResult = solc.compile(JSON.stringify(input));
      // console.log(compileResult);
      const result = JSON.parse(compileResult).contracts[fileName][this.contractName];
      // console.log(result);
      return result;
   }
}

module.exports = {Compiler}

const instance = new Compiler(__dirname,"Incrementer");
instance.compile();
