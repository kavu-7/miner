use anyhow::Result;
use clap::Parser;
use log::{info, warn, error};
use std::time::Duration;
use tokio::time::sleep;
use web3::{
    types::{BlockId, BlockNumber, H256},
    Web3,
};

/// HealthInsureChain Miner
/// Simulates block confirmation for policy blocks on Ethereum private chain
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Ethereum RPC URL (default: http://localhost:8545)
    #[arg(short, long, default_value = "http://localhost:8545")]
    rpc_url: String,

    /// Block confirmation threshold (default: 12)
    #[arg(short, long, default_value = "12")]
    confirmation_threshold: u64,

    /// Polling interval in seconds (default: 5)
    #[arg(short, long, default_value = "5")]
    poll_interval: u64,
}

/// Miner configuration
struct MinerConfig {
    rpc_url: String,
    confirmation_threshold: u64,
    poll_interval: Duration,
}

/// Policy block information
#[derive(Debug, Clone)]
struct PolicyBlock {
    block_number: u64,
    block_hash: H256,
    timestamp: u64,
    policy_count: u32,
}

/// HealthInsureChain Miner implementation
struct HealthInsureChainMiner {
    web3: Web3<web3::transports::Http>,
    config: MinerConfig,
    last_processed_block: u64,
}

impl HealthInsureChainMiner {
    /// Create a new miner instance
    fn new(config: MinerConfig) -> Result<Self> {
        let transport = web3::transports::Http::new(&config.rpc_url)?;
        let web3 = Web3::new(transport);

        Ok(Self {
            web3,
            config,
            last_processed_block: 0,
        })
    }

    /// Start the miner
    async fn start(&mut self) -> Result<()> {
        info!("Starting HealthInsureChain Miner...");
        info!("RPC URL: {}", self.config.rpc_url);
        info!("Confirmation threshold: {} blocks", self.config.confirmation_threshold);
        info!("Polling interval: {} seconds", self.config.poll_interval.as_secs());

        // Get the current block number to start from
        self.last_processed_block = self.get_current_block_number().await?;
        info!("Starting from block: {}", self.last_processed_block);

        loop {
            match self.process_new_blocks().await {
                Ok(blocks_processed) => {
                    if blocks_processed > 0 {
                        info!("Processed {} new blocks", blocks_processed);
                    }
                }
                Err(e) => {
                    error!("Error processing blocks: {}", e);
                }
            }

            sleep(self.config.poll_interval).await;
        }
    }

    /// Get the current block number
    async fn get_current_block_number(&self) -> Result<u64> {
        let block_number = self.web3.eth().block_number().await?;
        Ok(block_number.as_u64())
    }

    /// Process new blocks since last processed block
    async fn process_new_blocks(&mut self) -> Result<u64> {
        let current_block = self.get_current_block_number().await?;
        
        if current_block <= self.last_processed_block {
            return Ok(0);
        }

        let mut blocks_processed = 0;
        let start_block = self.last_processed_block + 1;
        let end_block = current_block;

        info!("Processing blocks {} to {}", start_block, end_block);

        for block_num in start_block..=end_block {
            match self.process_block(block_num).await {
                Ok(Some(policy_block)) => {
                    info!("Found policy block: {:?}", policy_block);
                    self.log_block_confirmation(&policy_block).await;
                    blocks_processed += 1;
                }
                Ok(None) => {
                    // No policy data in this block, continue
                }
                Err(e) => {
                    warn!("Error processing block {}: {}", block_num, e);
                }
            }
        }

        self.last_processed_block = end_block;
        Ok(blocks_processed)
    }

    /// Process a specific block and check for policy data
    async fn process_block(&self, block_number: u64) -> Result<Option<PolicyBlock>> {
        let block_id = BlockId::Number(BlockNumber::Number(block_number.into()));
        let block = self.web3.eth().block(block_id).await?;

        match block {
            Some(block) => {
                // Check if this block contains policy-related transactions
                let policy_count = self.count_policy_transactions(&block).await?;
                
                if policy_count > 0 {
                    Ok(Some(PolicyBlock {
                        block_number,
                        block_hash: block.hash.unwrap_or_default(),
                        timestamp: block.timestamp.as_u64(),
                        policy_count,
                    }))
                } else {
                    Ok(None)
                }
            }
            None => {
                warn!("Block {} not found", block_number);
                Ok(None)
            }
        }
    }

    /// Count policy-related transactions in a block
    async fn count_policy_transactions(&self, block: &web3::types::Block<H256>) -> Result<u32> {
        let mut policy_count = 0;

        // In web3, block.transactions is a Vec<H256> (transaction hashes), not full transactions
        // For simulation purposes, we'll assume any block with transactions might contain policy data
        if !block.transactions.is_empty() {
            policy_count = block.transactions.len() as u32;
        }

        Ok(policy_count)
    }


    /// Log block confirmation for policy blocks
    async fn log_block_confirmation(&self, policy_block: &PolicyBlock) {
        let confirmation_time = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .as_secs();

        info!("=== POLICY BLOCK CONFIRMED ===");
        info!("Block Number: {}", policy_block.block_number);
        info!("Block Hash: 0x{}", hex::encode(policy_block.block_hash.as_bytes()));
        info!("Timestamp: {}", policy_block.timestamp);
        info!("Policy Transactions: {}", policy_block.policy_count);
        info!("Confirmation Time: {}", confirmation_time);
        info!("Confirmation Threshold: {} blocks", self.config.confirmation_threshold);
        info!("=============================");

        // Simulate additional processing that might happen after confirmation
        self.simulate_post_confirmation_processing(policy_block).await;
    }

    /// Simulate post-confirmation processing
    async fn simulate_post_confirmation_processing(&self, policy_block: &PolicyBlock) {
        info!("Simulating post-confirmation processing for block {}", policy_block.block_number);
        
        // Simulate various post-confirmation tasks:
        // 1. Update policy status
        info!("  - Updating policy statuses");
        sleep(Duration::from_millis(100)).await;
        
        // 2. Trigger claim verification processes
        info!("  - Triggering claim verification processes");
        sleep(Duration::from_millis(150)).await;
        
        // 3. Update off-chain databases
        info!("  - Updating off-chain databases");
        sleep(Duration::from_millis(200)).await;
        
        // 4. Notify relevant parties
        info!("  - Notifying relevant parties");
        sleep(Duration::from_millis(100)).await;
        
        info!("Post-confirmation processing completed for block {}", policy_block.block_number);
    }

    /// Get miner statistics
    async fn get_stats(&self) -> Result<MinerStats> {
        let current_block = self.get_current_block_number().await?;
        let blocks_behind = current_block.saturating_sub(self.last_processed_block);
        
        Ok(MinerStats {
            current_block,
            last_processed_block: self.last_processed_block,
            blocks_behind,
            confirmation_threshold: self.config.confirmation_threshold,
        })
    }
}

/// Miner statistics
#[derive(Debug)]
struct MinerStats {
    current_block: u64,
    last_processed_block: u64,
    blocks_behind: u64,
    confirmation_threshold: u64,
}

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize logging
    env_logger::Builder::from_default_env()
        .filter_level(log::LevelFilter::Info)
        .init();

    // Parse command line arguments
    let args = Args::parse();

    // Create miner configuration
    let config = MinerConfig {
        rpc_url: args.rpc_url,
        confirmation_threshold: args.confirmation_threshold,
        poll_interval: Duration::from_secs(args.poll_interval),
    };

    // Create and start the miner
    let mut miner = HealthInsureChainMiner::new(config)?;
    
    // Print initial stats
    match miner.get_stats().await {
        Ok(stats) => {
            info!("Initial miner stats: {:?}", stats);
        }
        Err(e) => {
            warn!("Could not get initial stats: {}", e);
        }
    }

    // Start the miner (this will run indefinitely)
    miner.start().await?;

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_policy_block_creation() {
        let policy_block = PolicyBlock {
            block_number: 12345,
            block_hash: H256::from_low_u64_be(12345),
            timestamp: 1640995200,
            policy_count: 3,
        };

        assert_eq!(policy_block.block_number, 12345);
        assert_eq!(policy_block.policy_count, 3);
    }

    #[test]
    fn test_miner_config() {
        let config = MinerConfig {
            rpc_url: "http://localhost:8545".to_string(),
            confirmation_threshold: 12,
            poll_interval: Duration::from_secs(5),
        };

        assert_eq!(config.rpc_url, "http://localhost:8545");
        assert_eq!(config.confirmation_threshold, 12);
        assert_eq!(config.poll_interval.as_secs(), 5);
    }
}
