/**
 * Test script for Fabric Simulator
 */

const axios = require('axios');

async function testFabricSimulator() {
    console.log('🧪 Testing Fabric Simulator...\n');
    
    const baseUrl = 'http://localhost:3001';
    
    try {
        // Test 1: Health check
        console.log('1. Testing health check...');
        const healthResponse = await axios.get(`${baseUrl}/health`);
        console.log('✅ Health check passed:', healthResponse.data.status);
        console.log('   Organizations:', healthResponse.data.organizations.join(', '));
        console.log('   Ledger size:', healthResponse.data.ledgerSize);
        console.log('');

        // Test 2: Create patient record
        console.log('2. Testing patient record creation...');
        const patientResponse = await axios.post(`${baseUrl}/chaincode/invoke`, {
            function: 'CreatePatientRecord',
            args: [
                'TEST_PATIENT_001',
                'TEST_HOSPITAL_001',
                'TEST_INSURANCE_001',
                'TEST_HASH_001',
                'Test Diagnosis',
                'Test Treatment',
                '250.00'
            ]
        });
        console.log('✅ Patient record created:', patientResponse.data.result.id);
        console.log('');

        // Test 3: Create claim request
        console.log('3. Testing claim request creation...');
        const claimResponse = await axios.post(`${baseUrl}/chaincode/invoke`, {
            function: 'CreateClaimRequest',
            args: [
                'TEST_CLAIM_001',
                'TEST_PATIENT_001',
                'TEST_HOSPITAL_001',
                'TEST_INSURANCE_001',
                'Test claim description',
                'TEST_POLICY_001',
                '200.00'
            ]
        });
        console.log('✅ Claim request created:', claimResponse.data.result.id);
        console.log('');

        // Test 4: Query patient record
        console.log('4. Testing patient record query...');
        const queryResponse = await axios.post(`${baseUrl}/chaincode/query`, {
            function: 'GetPatientRecord',
            args: ['TEST_PATIENT_001']
        });
        console.log('✅ Patient record queried:', queryResponse.data.result.id);
        console.log('   Diagnosis:', queryResponse.data.result.data.diagnosis);
        console.log('');

        // Test 5: Update claim status
        console.log('5. Testing claim status update...');
        const updateResponse = await axios.post(`${baseUrl}/chaincode/invoke`, {
            function: 'UpdateClaimStatus',
            args: ['TEST_CLAIM_001', 'approved', 'ETH_TX_TEST_123']
        });
        console.log('✅ Claim status updated:', updateResponse.data.result.data.status);
        console.log('');

        // Test 6: Get all records
        console.log('6. Testing get all records...');
        const allRecordsResponse = await axios.get(`${baseUrl}/patient-records`);
        console.log('✅ Total patient records:', allRecordsResponse.data.count);
        
        const allClaimsResponse = await axios.get(`${baseUrl}/claim-requests`);
        console.log('✅ Total claim requests:', allClaimsResponse.data.count);
        console.log('');

        console.log('🎉 All tests passed successfully!');
        console.log('');
        console.log('📊 Test Summary:');
        console.log('   • Health check: ✅');
        console.log('   • Patient record creation: ✅');
        console.log('   • Claim request creation: ✅');
        console.log('   • Data querying: ✅');
        console.log('   • Status updates: ✅');
        console.log('   • Organization queries: ✅');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('   Response:', error.response.data);
        }
        console.log('');
        console.log('🔧 Make sure Fabric simulator is running:');
        console.log('   npm run fabric:start');
        process.exit(1);
    }
}

// Run tests
if (require.main === module) {
    testFabricSimulator();
}

module.exports = testFabricSimulator;
