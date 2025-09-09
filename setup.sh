
set -e

echo "🏥 HealthInsureChain Setup Script"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "foundry.toml" ]; then
    print_error "Please run this script from the HealthInsureChain root directory"
    exit 1
fi

print_status "Starting HealthInsureChain setup..."

# Check for required tools
print_status "Checking for required tools..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js (v16 or higher)"
    exit 1
else
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm"
    exit 1
else
    NPM_VERSION=$(npm --version)
    print_success "npm found: $NPM_VERSION"
fi

# Check Rust
if ! command -v cargo &> /dev/null; then
    print_error "Rust is not installed. Please install Rust from https://rustup.rs/"
    exit 1
else
    RUST_VERSION=$(cargo --version)
    print_success "Rust found: $RUST_VERSION"
fi

# Check Foundry
if ! command -v forge &> /dev/null; then
    print_warning "Foundry is not installed. Installing Foundry..."
    curl -L https://foundry.paradigm.xyz | bash
    export PATH="$HOME/.foundry/bin:$PATH"
    foundryup
    print_success "Foundry installed successfully"
else
    FORGE_VERSION=$(forge --version)
    print_success "Foundry found: $FORGE_VERSION"
fi

# Install Node.js dependencies
print_status "Installing Node.js dependencies..."
npm install
print_success "Node.js dependencies installed"

# Install Rust dependencies
print_status "Installing Rust dependencies..."
cd rust-miner
cargo build
cd ..
print_success "Rust dependencies installed"

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p deployments/localhost
mkdir -p logs
print_success "Directories created"

# Compile smart contracts
print_status "Compiling smart contracts..."
forge build
print_success "Smart contracts compiled"

# Create environment file template
print_status "Creating environment file template..."
cat > .env.example << EOF
# HealthInsureChain Environment Variables
# Copy this file to .env and fill in your values

# Ethereum RPC URL
RPC_URL=http://localhost:8545

# Private key for deployment (use a test key for development)
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Network name
NETWORK=localhost

# Miner configuration
MINER_RPC_URL=http://localhost:8545
MINER_POLL_INTERVAL=5
MINER_CONFIRMATION_THRESHOLD=12
EOF

if [ ! -f ".env" ]; then
    cp .env.example .env
    print_success "Environment file created (.env.example copied to .env)"
else
    print_warning "Environment file already exists, skipping creation"
fi

# Create a simple test script
print_status "Creating test script..."
cat > test-setup.sh << 'EOF'
#!/bin/bash

echo "🧪 Testing HealthInsureChain setup..."

# Test 1: Start local node
echo "Starting local Ethereum node..."
anvil &
ANVIL_PID=$!

# Wait for node to start
sleep 3

# Test 2: Deploy contracts
echo "Deploying contracts..."
forge script script/DeployPolicyClaim.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

# Test 3: Run workflow
echo "Running example workflow..."
forge script script/PolicyWorkflow.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

# Test 4: Test Rust miner (briefly)
echo "Testing Rust miner..."
cd rust-miner
timeout 10s cargo run -- --rpc-url http://localhost:8545 --poll-interval 1 || true
cd ..

# Cleanup
echo "Cleaning up..."
kill $ANVIL_PID 2>/dev/null || true

echo "✅ Setup test completed!"
EOF

chmod +x test-setup.sh
print_success "Test script created"

# Final setup summary
echo ""
echo "🎉 HealthInsureChain setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start local Ethereum node: anvil"
echo "2. Deploy contracts: npm run forge:deploy"
echo "3. Run example workflow: npm run forge:workflow"
echo "4. Start Rust miner: npm run miner"
echo "5. Test everything: ./test-setup.sh"
echo ""
echo "📚 Documentation:"
echo "- README.md: Complete project documentation"
echo "- src/PolicyClaim.sol: Main smart contract"
echo "- rust-miner/src/main.rs: Rust miner implementation"
echo "- js/: Node.js interaction scripts"
echo ""
echo "🔧 Available commands:"
echo "- npm run forge:build    # Compile contracts"
echo "- npm run forge:test     # Run tests"
echo "- npm run forge:deploy   # Deploy contracts"
echo "- npm run forge:workflow # Run example workflow"
echo "- npm run miner          # Start Rust miner"
echo "- npm run deploy         # Deploy with Hardhat"
echo "- npm run interact       # Interact with Hardhat"
echo ""
print_success "Setup complete! Happy coding! 🚀"
