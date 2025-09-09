// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PolicyClaim.sol";

/**
 * @title DeployPolicyClaim
 * @dev Deployment script for PolicyClaim contract
 * @notice Deploys the HealthInsureChain PolicyClaim contract to the network
 */
contract DeployPolicyClaim is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying contracts with the account:", deployer);
        console.log("Account balance:", deployer.balance);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy PolicyClaim contract
        PolicyClaim policyClaim = new PolicyClaim();
        
        vm.stopBroadcast();

        console.log("PolicyClaim deployed at:", address(policyClaim));
        console.log("Insurer address:", policyClaim.insurer());
        
        // Log deployment information
        console.log("=== DEPLOYMENT SUMMARY ===");
        console.log("Contract: PolicyClaim");
        console.log("Address:", address(policyClaim));
        console.log("Network: %s", vm.envString("NETWORK"));
        console.log("Deployer:", deployer);
        console.log("Block Number:", block.number);
        console.log("Block Timestamp:", block.timestamp);
        console.log("=========================");
    }
}
