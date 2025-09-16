/**
 * HealthInsureChain Fabric Integration Demo
 * Demonstrates Hospital-Insurance inter-org data sharing
 */

const EthereumFabricBridge = require('../fabric-simulator/ethereum-fabric-bridge');

async function main() {
    console.log('🏥 HealthInsureChain Fabric Integration Demo 🏥\n');

    // Configuration
    const ethereumConfig = {
        rpcUrl: 'http://localhost:8545',
        contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    };

    const fabricConfig = {
        url: 'http://localhost:3001'
    };

    try {
        // Initialize bridge
        console.log('🔗 Initializing Ethereum-Fabric Bridge...');
        const bridge = new EthereumFabricBridge(ethereumConfig, fabricConfig);
        
        // Check Fabric health
        console.log('🏥 Checking Fabric simulator health...');
        const health = await bridge.checkHealth();
        console.log('✅ Fabric Status:', health.status);
        console.log('📋 Organizations:', health.organizations.join(', '));
        console.log('🔗 Channel:', health.channel);
        console.log('📦 Chaincode:', health.chaincode);
        console.log('');

        // Demo 1: Create Patient Record
        console.log('📋 Demo 1: Creating Patient Record in Fabric');
        const patientRecord = await bridge.createPatientRecord({
            patientId: 'PAT_DEMO_001',
            hospitalId: 'HOSP_DEMO_001',
            insuranceId: 'INS_DEMO_001',
            diagnosis: 'Emergency Treatment',
            treatment: 'Surgery and Recovery',
            cost: 5000.00
        });
        console.log('✅ Patient record created:', patientRecord.id);
        console.log('');

        // Demo 2: Sync Policy from Ethereum
        console.log('🔄 Demo 2: Syncing Policy from Ethereum to Fabric');
        const policyId = 'POLICY_DEMO_001';
        const syncResult = await bridge.syncPolicyToFabric(policyId, 'PAT_DEMO_001');
        console.log('✅ Policy synced:', syncResult.id);
        console.log('');

        // Demo 3: Create Claim Request
        console.log('💰 Demo 3: Creating Claim Request');
        const claimRequest = await bridge.createClaimRequest({
            patientId: 'PAT_DEMO_001',
            hospitalId: 'HOSP_DEMO_001',
            insuranceId: 'INS_DEMO_001',
            policyId: policyId,
            description: 'Emergency surgery claim for patient PAT_DEMO_001',
            amount: 4500.00
        });
        console.log('✅ Claim request created:', claimRequest.claimId);
        console.log('');

        // Demo 4: Update Claim Status (simulating Ethereum processing)
        console.log('⚡ Demo 4: Updating Claim Status (Ethereum → Fabric)');
        const updateResult = await bridge.updateClaimStatus(
            claimRequest.claimId,
            'approved',
            'ETH_TX_APPROVED_12345'
        );
        console.log('✅ Claim status updated:', updateResult.data.status);
        console.log('');

        // Demo 5: Query Data
        console.log('🔍 Demo 5: Querying Data from Fabric');
        
        // Get all patient records
        const allRecords = await bridge.getAllPatientRecords();
        console.log('📊 Total patient records:', allRecords.length);
        
        // Get all claim requests
        const allClaims = await bridge.getAllClaimRequests();
        console.log('📊 Total claim requests:', allClaims.length);
        
        // Get records by hospital
        const hospitalRecords = await bridge.getRecordsByHospital('HOSP_DEMO_001');
        console.log('🏥 Records for HOSP_DEMO_001:', hospitalRecords.length);
        
        // Get claims by insurance
        const insuranceClaims = await bridge.getClaimsByInsurance('INS_DEMO_001');
        console.log('🏢 Claims for INS_DEMO_001:', insuranceClaims.length);
        console.log('');

        console.log('🎉 Demo completed successfully!');
        console.log('');
        console.log('📋 Summary:');
        console.log('   • Patient record created in Fabric');
        console.log('   • Policy synced from Ethereum to Fabric');
        console.log('   • Claim request created and processed');
        console.log('   • Data queried across organizations');
        console.log('   • Hospital-Insurance data sharing active');
        console.log('');
        console.log('🔗 Fabric Features Demonstrated:');
        console.log('   • Inter-organization data sharing');
        console.log('   • Cross-network synchronization');
        console.log('   • Automated claim processing');
        console.log('   • Real-time status updates');
        console.log('   • Comprehensive data queries');

    } catch (error) {
        console.error('❌ Demo failed:', error.message);
        console.log('');
        console.log('🔧 Troubleshooting:');
        console.log('   1. Make sure Fabric simulator is running: npm run fabric:start');
        console.log('   2. Check Fabric health: curl http://localhost:3001/health');
        console.log('   3. Verify all dependencies are installed');
        process.exit(1);
    }
}

// Run demo
if (require.main === module) {
    main().catch((error) => {
        console.error('❌ Demo execution failed:', error);
        process.exit(1);
    });
}

module.exports = main;
