// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PolicyStorage.sol";
import "../src/HealthToken.sol";
import "../src/HealthInsurance.sol";

contract Deploy is Script {
    function run() public {
        vm.startBroadcast();
        PolicyStorage ps = new PolicyStorage();
        HealthToken ht = new HealthToken(1000 ether);
        HealthInsurance hi = new HealthInsurance(address(ps), address(ht));
        vm.stopBroadcast();

        console.log("PolicyStorage deployed at:", address(ps));
        console.log("HealthToken deployed at:", address(ht));
        console.log("HealthInsurance deployed at:", address(hi));
    }
}