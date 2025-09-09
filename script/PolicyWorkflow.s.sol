// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PolicyClaim.sol";

/**
 * @title PolicyWorkflow
 * @dev Example workflow script demonstrating policy registration and claim processing
 * @notice Shows the complete HealthInsureChain workflow from policy registration to claim approval
 */
contract PolicyWorkflow is Script {
    PolicyClaim public policyClaim;
    
    // Test data
    address public policyHolder1 = address(0x1234567890123456789012345678901234567890);
    address public policyHolder2 = address(0x2345678901234567890123456789012345678901);
    
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Running HealthInsureChain workflow with account:", deployer);
        console.log("Account balance:", deployer.balance);

        vm.startBroadcast(deployerPrivateKey);

        // Step 1: Deploy PolicyClaim contract
        console.log("\n=== STEP 1: DEPLOYING POLICY CLAIM CONTRACT ===");
        policyClaim = new PolicyClaim();
        console.log("PolicyClaim deployed at:", address(policyClaim));

        // Step 2: Register policies
        console.log("\n=== STEP 2: REGISTERING POLICIES ===");
        bytes32 policyId1 = registerPolicy1();
        bytes32 policyId2 = registerPolicy2();
        
        // Step 3: Submit claims
        console.log("\n=== STEP 3: SUBMITTING CLAIMS ===");
        bytes32 claimId1 = submitClaim1(policyId1);
        bytes32 claimId2 = submitClaim2(policyId2);
        
        // Step 4: Process claims
        console.log("\n=== STEP 4: PROCESSING CLAIMS ===");
        processClaim(claimId1);
        processClaim(claimId2);
        
        // Step 5: Display results
        console.log("\n=== STEP 5: WORKFLOW RESULTS ===");
        displayResults();

        vm.stopBroadcast();
    }

    function registerPolicy1() internal returns (bytes32) {
        console.log("Registering Policy 1...");
        
        bytes32 policyId = policyClaim.registerPolicy(
            policyHolder1,           // policy holder
            10 ether,                // insured amount
            1 ether,                 // premium
            block.timestamp,         // start date
            block.timestamp + 365 days, // end date (1 year)
            "0xabc123def456ghi789"   // policy hash
        );
        
        console.log("Policy 1 registered with ID:", vm.toString(policyId));
        console.log("Policy Holder:", policyHolder1);
        console.log("Insured Amount: 10 ETH");
        console.log("Premium: 1 ETH");
        
        return policyId;
    }

    function registerPolicy2() internal returns (bytes32) {
        console.log("Registering Policy 2...");
        
        bytes32 policyId = policyClaim.registerPolicy(
            policyHolder2,           // policy holder
            5 ether,                 // insured amount
            0.5 ether,               // premium
            block.timestamp,         // start date
            block.timestamp + 180 days, // end date (6 months)
            "0xdef456ghi789jkl012"   // policy hash
        );
        
        console.log("Policy 2 registered with ID:", vm.toString(policyId));
        console.log("Policy Holder:", policyHolder2);
        console.log("Insured Amount: 5 ETH");
        console.log("Premium: 0.5 ETH");
        
        return policyId;
    }

    function submitClaim1(bytes32 policyId) internal returns (bytes32) {
        console.log("Submitting Claim 1...");
        
        // Impersonate policy holder 1
        vm.prank(policyHolder1);
        bytes32 claimId = policyClaim.submitClaim(
            policyId,
            3 ether,                 // claim amount
            "Medical treatment for emergency surgery"
        );
        
        console.log("Claim 1 submitted with ID:", vm.toString(claimId));
        console.log("Claim Amount: 3 ETH");
        console.log("Description: Medical treatment for emergency surgery");
        
        return claimId;
    }

    function submitClaim2(bytes32 policyId) internal returns (bytes32) {
        console.log("Submitting Claim 2...");
        
        // Impersonate policy holder 2
        vm.prank(policyHolder2);
        bytes32 claimId = policyClaim.submitClaim(
            policyId,
            6 ether,                 // claim amount (exceeds insured amount)
            "Comprehensive health checkup and treatment"
        );
        
        console.log("Claim 2 submitted with ID:", vm.toString(claimId));
        console.log("Claim Amount: 6 ETH");
        console.log("Description: Comprehensive health checkup and treatment");
        
        return claimId;
    }

    function processClaim(bytes32 claimId) internal {
        console.log("Processing claim:", vm.toString(claimId));
        
        bool approved = policyClaim.processClaim(claimId);
        
        if (approved) {
            console.log("Claim APPROVED");
        } else {
            console.log("Claim REJECTED");
        }
    }

    function displayResults() internal view {
        console.log("\n=== CONTRACT STATISTICS ===");
        (uint256 totalPolicies, uint256 totalClaims, uint256 activePolicies) = policyClaim.getContractStats();
        console.log("Total Policies:", totalPolicies);
        console.log("Total Claims:", totalClaims);
        console.log("Active Policies:", activePolicies);
        
        console.log("\n=== POLICY HOLDER 1 CLAIMS ===");
        bytes32[] memory userClaims1 = policyClaim.getUserClaims(policyHolder1);
        console.log("Number of claims:", userClaims1.length);
        
        console.log("\n=== POLICY HOLDER 2 CLAIMS ===");
        bytes32[] memory userClaims2 = policyClaim.getUserClaims(policyHolder2);
        console.log("Number of claims:", userClaims2.length);
        
        console.log("\n=== WORKFLOW COMPLETED ===");
        console.log("The HealthInsureChain workflow has been successfully demonstrated!");
        console.log("Policies were registered, claims were submitted and processed.");
    }
}
