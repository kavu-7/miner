// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract HealthToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("HealthToken", "HLT") {
        _mint(msg.sender, initialSupply);
    }
}