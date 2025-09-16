const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * HealthInsureChain Interaction Script
 * Demonstrates policy registration and claim processing workflow
 */
async function main() {
    console.log("🔗 Starting HealthInsureChain interaction demo...\n");

    // Load deployment information
    const deploymentPath = path.join(__dirname, "..", "deployments", network.name, "PolicyClaim.json");
    
    if (!fs.existsSync(deploymentPath)) {
        console.error("❌ Deployment information not found. Please run deployment first.");
        process.exit(1);
    }

    const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
    const contractAddress = deploymentInfo.contractAddress;

    // Get contract instance
    const PolicyClaim = await ethers.getContractFactory("PolicyClaim");
    const policyClaim = PolicyClaim.attach(contractAddress);

    console.log("📍 Connected to PolicyClaim at:", contractAddress);
    console.log("👤 Insurer:", await policyClaim.insurer());

    // Get signers
    const [deployer, policyHolder1, policyHolder2] = await ethers.getSigners();
    console.log("👤 Deployer:", deployer.address);
    console.log("👤 Policy Holder 1:", policyHolder1.address);
    console.log("👤 Policy Holder 2:", policyHolder2.address);

    try {
        // Step 1: Register Policies
        console.log("\n📋 === STEP 1: REGISTERING POLICIES ===");
        
        const policy1Tx = await policyClaim.registerPolicy(
            policyHolder1.address,
            ethers.parseEther("10"), // 10 ETH insured amount
            ethers.parseEther("1"),  // 1 ETH premium
            Math.floor(Date.now() / 1000), // start date (now)
            Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // end date (1 year)
            "0xabc123def456ghi789" // policy hash
        );
        await policy1Tx.wait();
        console.log("✅ Policy 1 registered for", policyHolder1.address);

        const policy2Tx = await policyClaim.registerPolicy(
            policyHolder2.address,
            ethers.parseEther("5"),  // 5 ETH insured amount
            ethers.parseEther("0.5"), // 0.5 ETH premium
            Math.floor(Date.now() / 1000), // start date (now)
            Math.floor(Date.now() / 1000) + (180 * 24 * 60 * 60), // end date (6 months)
            "0xdef456ghi789jkl012" // policy hash
        );
        await policy2Tx.wait();
        console.log("✅ Policy 2 registered for", policyHolder2.address);

        // Get policy IDs (we need to calculate them the same way as the contract)
        const policyId1 = ethers.keccak256(
            ethers.AbiCoder.defaultAbiCoder().encode(
                ["address", "uint256", "uint256", "uint256", "uint256", "uint256", "uint256"],
                [
                    policyHolder1.address,
                    ethers.parseEther("10"),
                    ethers.parseEther("1"),
                    Math.floor(Date.now() / 1000),
                    Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60),
                    Math.floor(Date.now() / 1000),
                    0 // totalPolicies was 0 when we started
                ]
            )
        );

        const policyId2 = ethers.keccak256(
            ethers.AbiCoder.defaultAbiCoder().encode(
                ["address", "uint256", "uint256", "uint256", "uint256", "uint256", "uint256"],
                [
                    policyHolder2.address,
                    ethers.parseEther("5"),
                    ethers.parseEther("0.5"),
                    Math.floor(Date.now() / 1000),
                    Math.floor(Date.now() / 1000) + (180 * 24 * 60 * 60),
                    Math.floor(Date.now() / 1000),
                    1 // totalPolicies was 1 for the second policy
                ]
            )
        );

        console.log("🆔 Policy 1 ID:", policyId1);
        console.log("🆔 Policy 2 ID:", policyId2);

        // Step 2: Submit Claims
        console.log("\n📝 === STEP 2: SUBMITTING CLAIMS ===");

        // Connect as policy holder 1
        const policyClaim1 = policyClaim.connect(policyHolder1);
        const claim1Tx = await policyClaim1.submitClaim(
            policyId1,
            ethers.parseEther("3"), // 3 ETH claim amount
            "Medical treatment for emergency surgery"
        );
        await claim1Tx.wait();
        console.log("✅ Claim 1 submitted by", policyHolder1.address);

        // Connect as policy holder 2
        const policyClaim2 = policyClaim.connect(policyHolder2);
        const claim2Tx = await policyClaim2.submitClaim(
            policyId2,
            ethers.parseEther("6"), // 6 ETH claim amount (exceeds insured amount)
            "Comprehensive health checkup and treatment"
        );
        await claim2Tx.wait();
        console.log("✅ Claim 2 submitted by", policyHolder2.address);

        // Step 3: Process Claims
        console.log("\n⚖️ === STEP 3: PROCESSING CLAIMS ===");

        // Get claim IDs (we need to calculate them)
        const claimId1 = ethers.keccak256(
            ethers.AbiCoder.defaultAbiCoder().encode(
                ["bytes32", "address", "uint256", "string", "uint256", "uint256"],
                [
                    policyId1,
                    policyHolder1.address,
                    ethers.parseEther("3"),
                    "Medical treatment for emergency surgery",
                    Math.floor(Date.now() / 1000),
                    0 // totalClaims was 0 when we started
                ]
            )
        );

        const claimId2 = ethers.keccak256(
            ethers.AbiCoder.defaultAbiCoder().encode(
                ["bytes32", "address", "uint256", "string", "uint256", "uint256"],
                [
                    policyId2,
                    policyHolder2.address,
                    ethers.parseEther("6"),
                    "Comprehensive health checkup and treatment",
                    Math.floor(Date.now() / 1000),
                    1 // totalClaims was 1 for the second claim
                ]
            )
        );

        console.log("🆔 Claim 1 ID:", claimId1);
        console.log("🆔 Claim 2 ID:", claimId2);

        // Process claim 1 (should be approved)
        console.log("\n🔄 Processing Claim 1...");
        const process1Tx = await policyClaim.processClaim(claimId1);
        await process1Tx.wait();
        const claim1 = await policyClaim.getClaim(claimId1);
        console.log("Claim 1 Status:", claim1.status === 1 ? "✅ APPROVED" : "❌ REJECTED");
        if (claim1.status === 2) {
            console.log("Rejection Reason:", claim1.rejectionReason);
        }

        // Process claim 2 (should be rejected - exceeds insured amount)
        console.log("\n🔄 Processing Claim 2...");
        const process2Tx = await policyClaim.processClaim(claimId2);
        await process2Tx.wait();
        const claim2 = await policyClaim.getClaim(claimId2);
        console.log("Claim 2 Status:", claim2.status === 1 ? "✅ APPROVED" : "❌ REJECTED");
        if (claim2.status === 2) {
            console.log("Rejection Reason:", claim2.rejectionReason);
        }

        // Step 4: Display Results
        console.log("\n📊 === STEP 4: RESULTS SUMMARY ===");
        const stats = await policyClaim.getContractStats();
        console.log("📈 Total Policies:", stats[0].toString());
        console.log("📈 Total Claims:", stats[1].toString());
        console.log("📈 Active Policies:", stats[2].toString());

        const userClaims1 = await policyClaim.getUserClaims(policyHolder1.address);
        const userClaims2 = await policyClaim.getUserClaims(policyHolder2.address);
        console.log("👤 Policy Holder 1 Claims:", userClaims1.length);
        console.log("👤 Policy Holder 2 Claims:", userClaims2.length);

        console.log("\n🎉 HealthInsureChain interaction demo completed successfully!");

    } catch (error) {
        console.error("❌ Interaction failed:", error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Script failed:", error);
        process.exit(1);
    });
