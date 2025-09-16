# HealthInsureChain

**Health Insurance Claim Verification with Blockchain Technology**



1. **Ethereum Private Chain** - Stores policy hashes and processes transactions
2. **Solidity Smart Contract** - Handles policy registration and claim verification
3. **Rust Miner** - Simulates block confirmation and monitors policy blocks


- **Policy Registration**: Register insurance policies with hashed values on blockchain
- **Automated Claim Verification**: Smart contract automatically verifies claim conditions
- **Block Confirmation**: Rust miner monitors and confirms policy blocks

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


---

**HealthInsureChain** - Revolutionizing health insurance with blockchain technology! 🏥⛓️