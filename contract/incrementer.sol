// SPDX-License-Identifier: MIT

pragma solidity >=0.4.0;

contract Incrementer {
    uint256 public number;

    constructor(uint _initialNumber) public {
        number = _initialNumber;
    }

    function increment(uint256 _value) public {
        number = number + _value;
    }

    function reset() public {
        number = 0;
    }
}