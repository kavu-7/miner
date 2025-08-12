require('dotenv').config();
const { ethers } = require('ethers');

const RPC = process.env.RPC_URL || 'http://127.0.0.1:8545';
const provider = new ethers.providers.JsonRpcProvider(RPC);

// ABI snippet to listen to PolicyStored
const policyStorageAbi = [
  "event PolicyStored(bytes32 indexed policyId, bytes32 policyHash, address indexed storedBy)",
];

const POLICY_STORAGE_ADDRESS = process.env.POLICY_STORAGE_ADDRESS; // set after deploy

async function main() {
  if (!POLICY_STORAGE_ADDRESS) {
    console.error('Set POLICY_STORAGE_ADDRESS in .env');
    process.exit(1);
  }

  const contract = new ethers.Contract(POLICY_STORAGE_ADDRESS, policyStorageAbi, provider);

  console.log('JS Miner started. Listening for PolicyStored events...');

  contract.on('PolicyStored', async (policyId, policyHash, storedBy) => {
    console.log('PolicyStored detected:', { policyId, policyHash, storedBy });

    // emulate a mining confirmation: call evm_mine via JSON-RPC
    try {
      await provider.send('evm_mine', []);
      console.log('Block mined (evm_mine) to confirm the policy storage');

      // Optionally, wait for next block
      await new Promise((res) => setTimeout(res, 200));
    } catch (err) {
      console.error('evm_mine failed:', err.message || err);
    }
  });

  // keep process alive
  process.stdin.resume();
}

main();