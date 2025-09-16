# HealthInsureChain

**Health Insurance Claim Verification with Blockchain Technology**

HealthInsureChain is a comprehensive blockchain-based system that automates insurance approvals and claim validation using Ethereum private chain, smart contracts, Rust-based miner, and Hyperledger Fabric simulator for Hospital-Insurance inter-org data sharing.

## 🏗️ Architecture

The system consists of four main components:

1. **Ethereum Private Chain** - Stores policy hashes and processes transactions
2. **Solidity Smart Contract** - Handles policy registration and claim verification
3. **Rust Miner** - Simulates block confirmation and monitors policy blocks
4. **Hyperledger Fabric Simulator** - Hospital-Insurance inter-org data sharing (minimalistic, no Docker)

## ✨ Features

- **Policy Registration**: Register insurance policies with hashed values on blockchain
- **Automated Claim Verification**: Smart contract automatically verifies claim conditions
- **Block Confirmation**: Rust miner monitors and confirms policy blocks
- **Hospital-Insurance Data Sharing**: Secure inter-organization data exchange via Fabric simulator
- **Cross-Network Integration**: Seamless synchronization between Ethereum and Fabric
- **REST API**: Complete API for interacting with Fabric simulator
- **Comprehensive Validation**: Checks policy validity, claim amounts, and time constraints
- **Event Logging**: Complete audit trail of all transactions and events

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Rust (latest stable version)
- Foundry (Forge, Anvil, Cast)
- Hardhat

### Installation

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd miner
   npm install
   ```

2. **Start Ethereum node**:
   ```bash
   npm run node
   ```

3. **Deploy contracts**:
   ```bash
   npm run forge:deploy
   ```

4. **Start Fabric simulator**:
   ```bash
   npm run fabric:start
   ```

5. **Run integration demo**:
   ```bash
   npm run fabric:demo
   ```

## 📁 Project Structure

```
miner/
├── src/                          # Solidity smart contracts
│   ├── PolicyClaim.sol          # Main contract for policy and claim management
│   ├── HealthInsurance.sol      # Legacy contract (for reference)
│   ├── HealthToken.sol          # ERC20 token contract
│   └── PolicyStorage.sol        # Legacy policy storage contract
├── script/                       # Foundry deployment scripts
│   ├── DeployPolicyClaim.s.sol  # Contract deployment script
│   └── PolicyWorkflow.s.sol     # Example workflow script
├── js/                          # Node.js interaction scripts
│   ├── deploy.js                # Hardhat deployment script
│   ├── interact.js              # Interaction demonstration script
│   └── fabric-demo.js           # Fabric integration demo
├── rust-miner/                  # Rust miner implementation
│   ├── src/
│   │   └── main.rs              # Main miner logic
│   └── Cargo.toml               # Rust dependencies
├── fabric-simulator/            # Hyperledger Fabric simulator
│   ├── fabric-simulator.js      # Main Fabric simulator
│   ├── ethereum-fabric-bridge.js # Cross-network bridge
│   ├── test-fabric.js           # Test suite
│   └── package.json             # Simulator dependencies
├── deployments/                 # Deployment information
├── foundry.toml                 # Foundry configuration
├── hardhat.config.js            # Hardhat configuration
└── package.json                 # Node.js dependencies and scripts
```

## 🔧 Available Scripts

### Ethereum Operations
- `npm run deploy` - Deploy smart contracts using Hardhat
- `npm run interact` - Run interaction demo
- `npm run forge:deploy` - Deploy contracts using Foundry
- `npm run forge:workflow` - Run complete workflow demo
- `npm run miner` - Start Rust miner
- `npm run miner:dev` - Start Rust miner with custom settings

### Fabric Operations
- `npm run fabric:start` - Start Fabric simulator
- `npm run fabric:test` - Test Fabric simulator
- `npm run fabric:demo` - Run integration demo

## 🏥 Hyperledger Fabric Simulator

The Fabric simulator (`fabric-simulator/`) provides:

- **Hospital-Insurance Data Sharing**: Secure inter-organization data exchange
- **Cross-Network Integration**: Seamless synchronization between Ethereum and Fabric
- **Patient Record Management**: Comprehensive patient data storage and retrieval
- **Claim Processing**: Automated claim request handling and status updates
- **REST API**: Complete API for interacting with Fabric simulator

### Fabric Simulator Features

- **No Docker Required**: Runs locally without Docker containers
- **In-Memory Ledger**: Simulates Fabric ledger using JavaScript Map
- **Organization Simulation**: Simulates Hospital and Insurance organizations
- **Chaincode Simulation**: Simulates Fabric chaincode functionality
- **Real-time Updates**: Live status updates and data synchronization

### Usage

```bash
# Start Fabric simulator
npm run fabric:start

# Test Fabric simulator
npm run fabric:test

# Run integration demo
npm run fabric:demo
```

## 🔄 Example Workflow

### Complete Cross-Network Workflow

1. **Policy Registration (Ethereum)**
   - Insurer registers a policy for a policy holder
   - Policy details are stored on-chain with hash verification
   - Policy becomes active and available for claims

2. **Policy Synchronization (Ethereum → Fabric)**
   - Policy data is automatically synced to Fabric simulator
   - Hospital and Insurance organizations can access policy information
   - Cross-network verification ensures data consistency

3. **Patient Record Creation (Fabric)**
   - Hospital creates patient record in Fabric simulator
   - Record includes diagnosis, treatment, and cost information
   - Data is shared with Insurance organization for claim processing

4. **Claim Submission (Cross-Network)**
   - Hospital submits claim request through Fabric API
   - Claim is created in both Ethereum and Fabric networks
   - Cross-network transaction IDs are linked for tracking

5. **Automated Verification (Ethereum)**
   - Smart contract automatically verifies claim conditions
   - Policy validity, claim amounts, and time constraints are checked

6. **Status Synchronization (Ethereum → Fabric)**
   - Claim status is updated in Fabric simulator
   - Hospital and Insurance organizations receive real-time updates
   - Cross-network event monitoring ensures consistency

7. **Result Processing (Cross-Network)**
   - Approved claims are marked as approved in both networks
   - Rejected claims include rejection reasons
   - All events are logged for audit purposes across networks

## 🧪 Testing

### Run Tests

```bash
# Foundry tests
npm run forge:test

# Fabric simulator tests
npm run fabric:test

# Compile contracts
npm run forge:build
```

## 🚀 Deployment

### Local Development

1. Start local Ethereum node (`npm run node`)
2. Deploy contracts (`npm run forge:deploy`)
3. Start Fabric simulator (`npm run fabric:start`)
4. Run example workflows (`npm run fabric:demo`)

## 🔮 Future Enhancements

- **Multi-token Support**: Support for different ERC20 tokens
- **Advanced Analytics**: Detailed analytics and reporting across both networks
- **Enhanced Integration**: More sophisticated cross-network synchronization
- **Mobile Support**: Mobile app for policy holders and hospital staff
- **Advanced Mining**: More sophisticated mining algorithms with Fabric integration
- **Real-time Notifications**: WebSocket support for real-time updates

## 📄 License

ISC

---

**HealthInsureChain** - Revolutionizing health insurance with blockchain technology! 🏥⛓️