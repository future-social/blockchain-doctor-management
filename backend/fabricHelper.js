const { Wallets, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function connectToGateway(DMSAdminId) {
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
            "An identity for the user " + DMSAdminId + " does not exist in the wallet"
            );
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: DMSAdminId,
            discovery: { enabled: true, asLocalhost: true },
        });
        return gateway;
    } catch (error) {
        console.error(`Failed to connect to gateway: ${error}`);
        throw error;
    }
}

module.exports = { connectToGateway };
