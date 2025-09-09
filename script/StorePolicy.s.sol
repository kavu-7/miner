// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PolicyStorage.sol";

contract StorePolicy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        address policyStorageAddr = vm.envAddress("POLICY_STORAGE_ADDRESS");
        PolicyStorage policyStorage = PolicyStorage(policyStorageAddr);

        // Example policy
        bytes32 policyId = keccak256(abi.encodePacked("POLICY-001"));
        string memory policyHash = "0xabc123hash";

        policyStorage.storePolicy(policyId, policyHash);

        vm.stopBroadcast();
    }
}
