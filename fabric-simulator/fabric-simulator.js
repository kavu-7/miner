/**
 * Minimalistic Hyperledger Fabric Simulator
 * Simulates Hospital-Insurance inter-org data sharing without Docker
 */

const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

class FabricSimulator {
    constructor() {
        this.app = express();
        this.app.use(cors());
        this.app.use(express.json());
        
        // Simulate Fabric ledger (in-memory storage)
        this.ledger = new Map();
        this.organizations = {
            'Hospital': {
                mspId: 'HospitalMSP',
                peers: ['peer0.hospital.healthinsurechain.com'],
                admin: 'Admin@hospital.healthinsurechain.com'
            },
            'Insurance': {
                mspId: 'InsuranceMSP', 
                peers: ['peer0.insurance.healthinsurechain.com'],
                admin: 'Admin@insurance.healthinsurechain.com'
            }
        };
        
        this.channel = 'healthinsurechain-channel';
        this.chaincode = 'healthinsurechain';
        
        this.setupRoutes();
        this.initializeLedger();
    }

    initializeLedger() {
        console.log('🏥 Initializing Fabric Simulator...');
        console.log('📋 Organizations:', Object.keys(this.organizations));
        console.log('🔗 Channel:', this.channel);
        console.log('📦 Chaincode:', this.chaincode);
        
        // Add some sample data
        this.createPatientRecord({
            patientId: 'PAT001',
            hospitalId: 'HOSP001',
            insuranceId: 'INS001',
            diagnosis: 'Routine Checkup',
            treatment: 'General Consultation',
            cost: 150.00
        });
        
        console.log('✅ Fabric Simulator initialized successfully!');
    }

    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                organizations: Object.keys(this.organizations),
                channel: this.channel,
                chaincode: this.chaincode,
                ledgerSize: this.ledger.size
            });
        });

        // Simulate chaincode invoke
        this.app.post('/chaincode/invoke', (req, res) => {
            const { function: func, args } = req.body;
            console.log(`🔧 Chaincode Invoke: ${func}`, args);
            
            try {
                const result = this.invokeChaincode(func, args);
                res.json({
                    success: true,
                    result: result,
                    transactionId: uuidv4(),
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        // Simulate chaincode query
        this.app.post('/chaincode/query', (req, res) => {
            const { function: func, args } = req.body;
            console.log(`🔍 Chaincode Query: ${func}`, args);
            
            try {
                const result = this.queryChaincode(func, args);
                res.json({
                    success: true,
                    result: result,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        // Get all patient records
        this.app.get('/patient-records', (req, res) => {
            const records = Array.from(this.ledger.values())
                .filter(item => item.type === 'PatientRecord');
            res.json({
                success: true,
                data: records,
                count: records.length
            });
        });

        // Get all claim requests
        this.app.get('/claim-requests', (req, res) => {
            const claims = Array.from(this.ledger.values())
                .filter(item => item.type === 'ClaimRequest');
            res.json({
                success: true,
                data: claims,
                count: claims.length
            });
        });

        // Get records by hospital
        this.app.get('/patient-records/hospital/:hospitalId', (req, res) => {
            const hospitalId = req.params.hospitalId;
            const records = Array.from(this.ledger.values())
                .filter(item => item.type === 'PatientRecord' && item.data.hospitalId === hospitalId);
            res.json({
                success: true,
                data: records,
                count: records.length
            });
        });

        // Get claims by insurance
        this.app.get('/claim-requests/insurance/:insuranceId', (req, res) => {
            const insuranceId = req.params.insuranceId;
            const claims = Array.from(this.ledger.values())
                .filter(item => item.type === 'ClaimRequest' && item.data.insuranceId === insuranceId);
            res.json({
                success: true,
                data: claims,
                count: claims.length
            });
        });
    }

    invokeChaincode(func, args) {
        switch (func) {
            case 'CreatePatientRecord':
                return this.createPatientRecord({
                    patientId: args[0],
                    hospitalId: args[1],
                    insuranceId: args[2],
                    recordHash: args[3],
                    diagnosis: args[4],
                    treatment: args[5],
                    cost: parseFloat(args[6])
                });

            case 'CreateClaimRequest':
                return this.createClaimRequest({
                    claimId: args[0],
                    patientId: args[1],
                    hospitalId: args[2],
                    insuranceId: args[3],
                    description: args[4],
                    policyId: args[5],
                    amount: parseFloat(args[6])
                });

            case 'UpdateClaimStatus':
                return this.updateClaimStatus(args[0], args[1], args[2]);

            case 'VerifyPolicyWithEthereum':
                return this.verifyPolicyWithEthereum({
                    policyId: args[0],
                    patientId: args[1],
                    isValid: args[2] === 'true',
                    coverageAmount: parseFloat(args[3]),
                    expiryDate: args[4],
                    ethereumTxHash: args[5]
                });

            default:
                throw new Error(`Unknown function: ${func}`);
        }
    }

    queryChaincode(func, args) {
        switch (func) {
            case 'GetPatientRecord':
                return this.getPatientRecord(args[0]);

            case 'GetClaimRequest':
                return this.getClaimRequest(args[0]);

            case 'GetAllPatientRecords':
                return this.getAllPatientRecords();

            case 'GetAllClaimRequests':
                return this.getAllClaimRequests();

            case 'QueryRecordsByHospital':
                return this.queryRecordsByHospital(args[0]);

            case 'QueryClaimsByInsurance':
                return this.queryClaimsByInsurance(args[0]);

            default:
                throw new Error(`Unknown query function: ${func}`);
        }
    }

    createPatientRecord(data) {
        const record = {
            type: 'PatientRecord',
            id: data.patientId,
            data: {
                ...data,
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        };
        
        this.ledger.set(data.patientId, record);
        console.log(`📋 Created patient record: ${data.patientId}`);
        return record;
    }

    createClaimRequest(data) {
        const claim = {
            type: 'ClaimRequest',
            id: data.claimId,
            data: {
                ...data,
                status: 'submitted',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        };
        
        this.ledger.set(data.claimId, claim);
        console.log(`💰 Created claim request: ${data.claimId}`);
        return claim;
    }

    updateClaimStatus(claimId, status, ethereumTxHash) {
        const claim = this.ledger.get(claimId);
        if (!claim) {
            throw new Error(`Claim ${claimId} not found`);
        }
        
        claim.data.status = status;
        claim.data.ethereumTxHash = ethereumTxHash;
        claim.data.updatedAt = new Date().toISOString();
        
        this.ledger.set(claimId, claim);
        console.log(`🔄 Updated claim ${claimId} status to: ${status}`);
        return claim;
    }

    verifyPolicyWithEthereum(data) {
        const verification = {
            type: 'PolicyVerification',
            id: `VERIFICATION_${data.policyId}_${data.patientId}`,
            data: {
                ...data,
                verifiedAt: new Date().toISOString()
            }
        };
        
        this.ledger.set(verification.id, verification);
        console.log(`✅ Verified policy ${data.policyId} for patient ${data.patientId}`);
        return verification;
    }

    getPatientRecord(patientId) {
        const record = this.ledger.get(patientId);
        if (!record || record.type !== 'PatientRecord') {
            throw new Error(`Patient record ${patientId} not found`);
        }
        return record;
    }

    getClaimRequest(claimId) {
        const claim = this.ledger.get(claimId);
        if (!claim || claim.type !== 'ClaimRequest') {
            throw new Error(`Claim request ${claimId} not found`);
        }
        return claim;
    }

    getAllPatientRecords() {
        return Array.from(this.ledger.values())
            .filter(item => item.type === 'PatientRecord');
    }

    getAllClaimRequests() {
        return Array.from(this.ledger.values())
            .filter(item => item.type === 'ClaimRequest');
    }

    queryRecordsByHospital(hospitalId) {
        return Array.from(this.ledger.values())
            .filter(item => item.type === 'PatientRecord' && item.data.hospitalId === hospitalId);
    }

    queryClaimsByInsurance(insuranceId) {
        return Array.from(this.ledger.values())
            .filter(item => item.type === 'ClaimRequest' && item.data.insuranceId === insuranceId);
    }

    start(port = 3001) {
        this.app.listen(port, () => {
            console.log(`🚀 Fabric Simulator running on port ${port}`);
            console.log(`📡 Health check: http://localhost:${port}/health`);
            console.log(`🔧 Chaincode invoke: http://localhost:${port}/chaincode/invoke`);
            console.log(`🔍 Chaincode query: http://localhost:${port}/chaincode/query`);
            console.log('');
            console.log('🏥 Hospital-Insurance inter-org data sharing is now active!');
        });
    }
}

// Start the simulator
const fabricSimulator = new FabricSimulator();
fabricSimulator.start();

module.exports = FabricSimulator;
