// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PolicyStorage {
    event PolicyStored(uint256 policyId, string policyData);

    uint256 public nextPolicyId;
    mapping(bytes32 => bytes32) public policies;

    function storePolicy(string memory policyData) public {
        emit PolicyStored(nextPolicyId, policyData);
        nextPolicyId++;
    }

    function storePolicy(bytes32 policyId, string memory policyHash) public {
        policies[policyId] = keccak256(abi.encodePacked(policyHash));
        emit PolicyStored(nextPolicyId, policyHash);
        nextPolicyId++;
    }

    function getPolicy(bytes32 policyId) public view returns (bytes32) {
        return policies[policyId];
    }
}
