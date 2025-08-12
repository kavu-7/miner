// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PolicyStorage.sol";
import "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract HealthInsurance {
    PolicyStorage public policyStorage;
    IERC20 public rewardToken;
    address public insurer;

    event ClaimSubmitted(bytes32 indexed policyId, address indexed claimant, uint256 amount, bool approved);

    constructor(address _policyStorage, address _rewardToken) {
        policyStorage = PolicyStorage(_policyStorage);
        rewardToken = IERC20(_rewardToken);
        insurer = msg.sender;
    }

    // Simplified claim verification: pass a policyId and claim amount;
    // checks whether policy hash exists (i.e. policy registered) then approves if exists.
    function submitClaim(bytes32 policyId, uint256 amount) external returns (bool) {
        bytes32 ph = policyStorage.getPolicy(policyId);
        bool approved = (ph != bytes32(0));
        if (approved) {
            // reward the claimant with a small token payout to show on-chain action
            try rewardToken.transfer(msg.sender, 1e18) {} catch {}
        }
        emit ClaimSubmitted(policyId, msg.sender, amount, approved);
        return approved;
    }
}