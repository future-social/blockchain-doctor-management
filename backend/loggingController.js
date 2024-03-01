// Logging functions
const { Wallets, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function logActivity(userId, activityDescription) {
    try {
        // Create a log entry
        const logEntry = {
            userId: userId,
            timestamp: new Date().toISOString(),
            activityDescription: activityDescription
        };

        // Connect to the blockchain gateway
        const gateway = await connectToGateway();

        // Get the network and contract
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('mycontract');

        // Submit the transaction to add the log entry to the blockchain
        await contract.submitTransaction('LogActivity', JSON.stringify(logEntry));

        // Disconnect from the gateway
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to log activity: ${error}`);
        throw error;
    }
}

async function retrieveLogs() {
    try {
        // Connect to the blockchain gateway
        const gateway = await connectToGateway();

        // Get the network and contract
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('mycontract');

        // Submit a query to retrieve all log entries from the blockchain
        const result = await contract.evaluateTransaction('RetrieveLogs');
        const logs = JSON.parse(result.toString());

        // Disconnect from the gateway
        await gateway.disconnect();

        return logs;
    } catch (error) {
        console.error(`Failed to retrieve logs: ${error}`);
        throw error;
    }
}

// Helper function to connect to the blockchain gateway
async function connectToGateway() {
    // Load connection profile
    const ccpPath = path.resolve(__dirname, 'connection.json');
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    const ccp = JSON.parse(ccpJSON);

    // Connect to the gateway
    const walletPath = path.resolve(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const identity = await wallet.get('user1');
    if (!identity) {
        throw new Error('An identity for the user "user1" does not exist in the wallet');
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: 'user1',
        discovery: { enabled: true, asLocalhost: true }
    });

    return gateway;
}

module.exports = { logActivity, retrieveLogs };
