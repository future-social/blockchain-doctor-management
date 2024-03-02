const { Wallets, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function createDoctor(doctorData) {
    try {
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

        // Get the network and contract
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('mycontract');

        // Submit the transaction to create a new doctor
        await contract.submitTransaction('CreateDoctor', JSON.stringify(doctorData));
        console.log('Doctor data created successfully');

        // Disconnect from the gateway
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to create doctor data: ${error}`);
        throw error;
    }
}

async function retrieveDoctor(doctorId) {
    try {
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

        // Get the network and contract
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('mycontract');

        // Submit the transaction to retrieve doctor data by ID
        const result = await contract.evaluateTransaction('RetrieveDoctor', doctorId);
        console.log(`Doctor data retrieved: ${result.toString()}`);

        // Disconnect from the gateway
        await gateway.disconnect();
        return result.toString();
    } catch (error) {
        console.error(`Failed to retrieve doctor data: ${error}`);
        throw error;
    }
}

async function updateDoctor(doctorId, updatedData) {
    try {
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

        // Get the network and contract
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('mycontract');

        // Submit the transaction to update doctor data
        await contract.submitTransaction('UpdateDoctor', doctorId, JSON.stringify(updatedData));
        console.log('Doctor data updated successfully');

        // Disconnect from the gateway
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to update doctor data: ${error}`);
        throw error;
    }
}

module.exports = { createDoctor, retrieveDoctor, updateDoctor };
