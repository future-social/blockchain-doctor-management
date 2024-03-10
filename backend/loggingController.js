const { Wallets, Gateway } = require("fabric-network");
const fs = require("fs");
const path = require("path");
const moment = require('moment');
// const fabricHelper = require('./fabricHelper');

async function retrieveLogs(DMSAdminId) {
    try {
        // Load connection profile
        const ccpPath = path.resolve(
            __dirname,
            "..",
            "..",
            "blockchain-doctor-management",
            "test-network",
            "organizations",
            "peerOrganizations",
            "org1.example.com",
            "connection-org1.json"
        );
        const ccpJSON = fs.readFileSync(ccpPath, "utf8");
        const ccp = JSON.parse(ccpJSON);
    
        // Connect to the gateway
        const walletPath = path.resolve(__dirname, "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        const identity = await wallet.get(DMSAdminId);
        if (!identity) {
            throw new Error(
            "An identity for the user " +
                DMSAdminId +
                " does not exist in the wallet"
            );
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: DMSAdminId,
            discovery: { enabled: true, asLocalhost: true },
        });
    
        // Get the network and contract
        const network = await gateway.getNetwork("medicpro");
        const contract = network.getContract("basic");
  
        // Submit the transaction
        const result = await contract.evaluateTransaction("RetrieveLogs");
        console.log(`Logs retrieved: ${result.toString()}`);

        // Parse the result as JSON
        const logs = JSON.parse(result.toString());
        
        // Disconnect from the gateway
        await gateway.disconnect();
        return logs;
    } catch (error) {
        console.error(`Failed to retrieve logs: ${error}`);
        throw error;
    }
}

module.exports = { retrieveLogs };
