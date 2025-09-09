# HealthInsureChain

**Health Insurance Claim Verification with Blockchain Technology**

HealthInsureChain is a comprehensive blockchain-based system that automates insurance approvals and claim validation using Ethereum private chain, smart contracts, and a Rust-based miner for block confirmation simulation.

##  Architecture

The system consists of three main components:

1. **Ethereum Private Chain** - Stores policy hashes and processes transactions
2. **Solidity Smart Contract** - Handles policy registration and claim verification
3. **Rust Miner** - Simulates block confirmation and monitors policy blocks

##  Features

- **Policy Registration**: Register insurance policies with hashed values on blockchain
- **Automated Claim Verification**: Smart contract automatically verifies claim conditions
- **Block Confirmation**: Rust miner monitors and confirms policy blocks
- **Comprehensive Validation**: Checks policy validity, claim amounts, and time constraints
- **Event Logging**: Complete audit trail of all transactions and events

##  Requirements

- Node.js (v16 or higher)
- Rust (latest stable version)
- Foundry (Forge, Anvil, Cast)
- Hardhat
- Git

##  Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd miner
git checkout healthinsurechain-implementation
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Rust dependencies
cd rust-miner
cargo build
cd ..
```

### 3. Install Foundry (if not already installed)

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

##  Quick Start

### 1. Start Local Ethereum Node

```bash
# Using Anvil (Foundry)
anvil

# Or using Hardhat
npm run node
```

### 2. Deploy Smart Contracts

```bash
# Using Foundry
npm run forge:deploy

# Or using Hardhat
npm run deploy
```

### 3. Run Example Workflow

```bash
# Using Foundry
npm run forge:workflow

# Or using Hardhat
npm run interact
```

### 4. Start Rust Miner

```bash
# Start miner with default settings
npm run miner

# Start miner with custom settings
npm run miner:dev
```

##  Project Structure

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
│   └── interact.js              # Interaction demonstration script
├── rust-miner/                  # Rust miner implementation
│   ├── src/
│   │   └── main.rs              # Main miner logic
│   └── Cargo.toml               # Rust dependencies
├── deployments/                 # Deployment information
├── foundry.toml                 # Foundry configuration
├── hardhat.config.js            # Hardhat configuration
└── package.json                 # Node.js dependencies and scripts
```

##  Smart Contract Details

### PolicyClaim.sol

The main smart contract that handles:

- **Policy Registration**: Register insurance policies with comprehensive validation
- **Claim Submission**: Submit claims against registered policies
- **Automated Verification**: Automatically verify claim conditions
- **Policy Management**: Activate/deactivate policies


##  Rust Miner

The Rust miner (`rust-miner/`) provides:

- **Block Monitoring**: Continuously monitors the Ethereum chain for new blocks
- **Policy Detection**: Identifies blocks containing policy-related transactions
- **Confirmation Simulation**: Simulates block confirmation process
- **Event Logging**: Comprehensive logging of all miner activities

### Miner Features

- Configurable RPC URL and polling interval
- Block confirmation threshold settings
- Policy transaction detection
- Post-confirmation processing simulation
- Comprehensive error handling and logging

### Usage

```bash
# Basic usage
cargo run

# With custom parameters
cargo run -- --rpc-url http://localhost:8545 --poll-interval 5 --confirmation-threshold 12
```

##  Example Workflow

1. **Policy Registration**
   - Insurer registers a policy for a policy holder
   - Policy details are stored on-chain with hash verification
   - Policy becomes active and available for claims

2. **Claim Submission**
   - Policy holder submits a claim with amount and description
   - Claim is recorded on-chain with pending status

3. **Automated Verification**
   - Smart contract automatically verifies claim conditions:
     - Policy is valid and active
     - Claim amount ≤ insured amount
     - Claim amount ≤ maximum allowed ratio (80%)
     - Policy is within valid time period

4. **Block Confirmation**
   - Rust miner monitors for policy blocks
   - Confirms blocks containing policy transactions
   - Logs confirmation details and triggers post-processing

5. **Result Processing**
   - Approved claims are marked as approved
   - Rejected claims include rejection reasons
   - All events are logged for audit purposes

##  Testing

### Run Tests

```bash
# Foundry tests
npm run forge:test

# Compile contracts
npm run forge:build
```

### Example Test Scenarios

1. **Valid Policy Registration**: Register policy with valid parameters
2. **Invalid Policy Registration**: Attempt to register with invalid parameters
3. **Valid Claim Submission**: Submit claim within policy limits
4. **Invalid Claim Submission**: Submit claim exceeding policy limits
5. **Policy Expiration**: Test claims after policy expiration
6. **Block Confirmation**: Test miner block confirmation process

##  Security Features

- **Access Control**: Only insurer can register policies
- **Input Validation**: Comprehensive validation of all inputs
- **Amount Limits**: Maximum claim ratio enforcement
- **Time Validation**: Policy validity period checks
- **Event Logging**: Complete audit trail

##  Performance Considerations

- **Gas Optimization**: Efficient contract design for minimal gas usage
- **Batch Processing**: Support for multiple operations in single transaction
- **Event Filtering**: Efficient event filtering for miner operations
- **Error Handling**: Robust error handling and recovery

##  Deployment

### Local Development

1. Start local Ethereum node (Anvil or Hardhat)
2. Deploy contracts using provided scripts
3. Start Rust miner
4. Run example workflows

### Production Deployment

1. Configure production RPC URL
2. Update private keys and addresses
3. Deploy to target network
4. Configure miner for production environment

##  Future Enhancements

- **Multi-token Support**: Support for different ERC20 tokens
- **Advanced Analytics**: Detailed analytics and reporting
- **Integration APIs**: REST APIs for external integration
- **Mobile Support**: Mobile app for policy holders
- **Advanced Mining**: More sophisticated mining algorithms
- **Cross-chain Support**: Support for multiple blockchain networks

---

**HealthInsureChain** - Revolutionizing health insurance with blockchain technology! 🏥⛓️