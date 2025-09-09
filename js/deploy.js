const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * HealthInsureChain Deployment Script
 * Deploys the PolicyClaim contract and saves deployment information
 */
async function main() {
    console.log("🚀 Starting HealthInsureChain deployment...\n");

    // Get the contract factory
    const PolicyClaim = await ethers.getContractFactory("PolicyClaim");

    // Deploy the contract
    console.log("📄 Deploying PolicyClaim contract...");
    const policyClaim = await PolicyClaim.deploy();
    await policyClaim.waitForDeployment();

    const contractAddress = await policyClaim.getAddress();
    const insurer = await policyClaim.insurer();

    console.log("✅ PolicyClaim deployed successfully!");
    console.log("📍 Contract Address:", contractAddress);
    console.log("👤 Insurer Address:", insurer);
    console.log("🔗 Network:", network.name);
    console.log("⛽ Gas Used:", (await policyClaim.deploymentTransaction()).gasLimit.toString());

    // Save deployment information
    const deploymentInfo = {
        contractAddress: contractAddress,
        insurer: insurer,
        network: network.name,
        blockNumber: await ethers.provider.getBlockNumber(),
        timestamp: new Date().toISOString(),
        abi: PolicyClaim.interface.format("json")
    };

    const deploymentPath = path.join(__dirname, "..", "deployments", network.name);
    if (!fs.existsSync(deploymentPath)) {
        fs.mkdirSync(deploymentPath, { recursive: true });
    }

    fs.writeFileSync(
        path.join(deploymentPath, "PolicyClaim.json"),
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("\n💾 Deployment information saved to:", path.join(deploymentPath, "PolicyClaim.json"));
    console.log("\n🎉 HealthInsureChain deployment completed successfully!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
