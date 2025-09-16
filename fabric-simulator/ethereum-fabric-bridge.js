/**
 * Ethereum-Fabric Bridge for HealthInsureChain
 * Connects Ethereum blockchain with Fabric simulator
 */

const axios = require('axios');

class EthereumFabricBridge {
    constructor(ethereumConfig, fabricConfig) {
        this.ethereumConfig = ethereumConfig;
        this.fabricConfig = fabricConfig;
        this.fabricUrl = fabricConfig.url || 'http://localhost:3001';
    }

    /**
     * Sync policy data from Ethereum to Fabric
     */
    async syncPolicyToFabric(policyId, patientId) {
        try {
            console.log(`🔄 Syncing policy ${policyId} to Fabric...`);
            
            const policyData = {
                policyId: policyId,
                patientId: patientId,
                isValid: true, // Simulated validation
                coverageAmount: 10000.00, // Simulated coverage
                expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
                ethereumTxHash: `ETH_TX_${Date.now()}`
            };

            const response = await axios.post(`${this.fabricUrl}/chaincode/invoke`, {
                function: 'VerifyPolicyWithEthereum',
                args: [
                    policyData.policyId,
                    policyData.patientId,
                    policyData.isValid.toString(),
                    policyData.coverageAmount.toString(),
                    policyData.expiryDate,
                    policyData.ethereumTxHash
                ]
            });

            console.log(`✅ Policy ${policyId} synced to Fabric successfully`);
            return response.data.result;
        } catch (error) {
            console.error(`❌ Failed to sync policy ${policyId} to Fabric:`, error.message);
            throw error;
        }
    }

    /**
     * Create patient record in Fabric
     */
    async createPatientRecord(patientData) {
        try {
            console.log(`📋 Creating patient record for ${patientData.patientId}...`);
            
            const recordHash = `HASH_${Date.now()}_${patientData.patientId}`;
            
            const response = await axios.post(`${this.fabricUrl}/chaincode/invoke`, {
                function: 'CreatePatientRecord',
                args: [
                    patientData.patientId,
                    patientData.hospitalId,
                    patientData.insuranceId,
                    recordHash,
                    patientData.diagnosis,
                    patientData.treatment,
                    patientData.cost.toString()
                ]
            });

            console.log(`✅ Patient record created for ${patientData.patientId}`);
            return response.data.result;
        } catch (error) {
            console.error(`❌ Failed to create patient record:`, error.message);
            throw error;
        }
    }

    /**
     * Create claim request in Fabric
     */
    async createClaimRequest(claimData) {
        try {
            console.log(`💰 Creating claim request...`);
            
            const claimId = `CLAIM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            const response = await axios.post(`${this.fabricUrl}/chaincode/invoke`, {
                function: 'CreateClaimRequest',
                args: [
                    claimId,
                    claimData.patientId,
                    claimData.hospitalId,
                    claimData.insuranceId,
                    claimData.description,
                    claimData.policyId,
                    claimData.amount.toString()
                ]
            });

            console.log(`✅ Claim request created: ${claimId}`);
            return {
                claimId: claimId,
                result: response.data.result,
                ethereumTxHash: `ETH_TX_${Date.now()}`
            };
        } catch (error) {
            console.error(`❌ Failed to create claim request:`, error.message);
            throw error;
        }
    }

    /**
     * Update claim status in Fabric
     */
    async updateClaimStatus(claimId, status, ethereumTxHash) {
        try {
            console.log(`🔄 Updating claim ${claimId} status to: ${status}`);
            
            const response = await axios.post(`${this.fabricUrl}/chaincode/invoke`, {
                function: 'UpdateClaimStatus',
                args: [claimId, status, ethereumTxHash]
            });

            console.log(`✅ Claim ${claimId} status updated successfully`);
            return response.data.result;
        } catch (error) {
            console.error(`❌ Failed to update claim status:`, error.message);
            throw error;
        }
    }

    /**
     * Get all patient records from Fabric
     */
    async getAllPatientRecords() {
        try {
            const response = await axios.get(`${this.fabricUrl}/patient-records`);
            return response.data.data;
        } catch (error) {
            console.error(`❌ Failed to get patient records:`, error.message);
            throw error;
        }
    }

    /**
     * Get all claim requests from Fabric
     */
    async getAllClaimRequests() {
        try {
            const response = await axios.get(`${this.fabricUrl}/claim-requests`);
            return response.data.data;
        } catch (error) {
            console.error(`❌ Failed to get claim requests:`, error.message);
            throw error;
        }
    }

    /**
     * Get records by hospital
     */
    async getRecordsByHospital(hospitalId) {
        try {
            const response = await axios.get(`${this.fabricUrl}/patient-records/hospital/${hospitalId}`);
            return response.data.data;
        } catch (error) {
            console.error(`❌ Failed to get records by hospital:`, error.message);
            throw error;
        }
    }

    /**
     * Get claims by insurance
     */
    async getClaimsByInsurance(insuranceId) {
        try {
            const response = await axios.get(`${this.fabricUrl}/claim-requests/insurance/${insuranceId}`);
            return response.data.data;
        } catch (error) {
            console.error(`❌ Failed to get claims by insurance:`, error.message);
            throw error;
        }
    }

    /**
     * Check Fabric health
     */
    async checkHealth() {
        try {
            const response = await axios.get(`${this.fabricUrl}/health`);
            return response.data;
        } catch (error) {
            console.error(`❌ Fabric health check failed:`, error.message);
            throw error;
        }
    }
}

module.exports = EthereumFabricBridge;
