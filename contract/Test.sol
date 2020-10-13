// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.7.0;

contract Test {
    function add(uint p1, uint p2) public pure returns(uint) {
        return p1 + p2;
    }

    function requireTest(uint v) public pure returns(bool) {
        require(v > 5, "value must bigger than 5");

        return true;
    }
}