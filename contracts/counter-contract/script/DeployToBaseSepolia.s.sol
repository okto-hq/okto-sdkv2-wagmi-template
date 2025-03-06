// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Counter} from "../src/Counter.sol";

contract DeployToBaseSepoliaScript is Script {
    function run() public {
        // Retrieve the private key from environment variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the Counter contract
        Counter counter = new Counter();
        console.log("Counter deployed at:", address(counter));

        // Stop broadcasting transactions
        vm.stopBroadcast();
    }
} 