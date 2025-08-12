// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PolicyStorage {
    event PolicyStored(uint256 policyId, string policyData);

    uint256 public nextPolicyId;

    function storePolicy(string memory policyData) public {
        emit PolicyStored(nextPolicyId, policyData);
        nextPolicyId++;
    }
}
