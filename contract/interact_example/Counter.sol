// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.7.1;

contract Counter {
    uint256 private _count;
    address private _owner;

    event Increment(uint256);

    modifier onlyOwner() {
        require(msg.sender == _owner, "You're not the owner of the contract");
        _;
    }

    constructor() {
        _owner = msg.sender;
    }

    function changeOwner(address newOwner) public onlyOwner {
        _owner = newOwner;
    }

    function getCount() public view returns (uint256) {
        return _count;
    }

    function increment() public onlyOwner {
        _count++;
        emit Increment(_count);
    }
}
