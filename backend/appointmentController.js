const { Wallets, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function createAppointment(appointmentData) {
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

        // Submit the transaction to create a new appointment
        await contract.submitTransaction('CreateAppointment', JSON.stringify(appointmentData));
        console.log('Appointment created successfully');

        // Disconnect from the gateway
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to create appointment: ${error}`);
        throw error;
    }
}

async function retrieveAppointment(appointmentId) {
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

        // Submit the transaction to retrieve appointment data by ID
        const result = await contract.evaluateTransaction('RetrieveAppointment', appointmentId);
        console.log(`Appointment data retrieved: ${result.toString()}`);

        // Disconnect from the gateway
        await gateway.disconnect();
        return result.toString();
    } catch (error) {
        console.error(`Failed to retrieve appointment data: ${error}`);
        throw error;
    }
}

async function updateAppointment(appointmentId, updatedData) {
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

        // Submit the transaction to update appointment data
        await contract.submitTransaction('UpdateAppointment', appointmentId, JSON.stringify(updatedData));
        console.log('Appointment data updated successfully');

        // Disconnect from the gateway
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to update appointment data: ${error}`);
        throw error;
    }
}

async function deleteAppointment(appointmentId) {
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

        // Submit the transaction to delete appointment data by ID
        await contract.submitTransaction('DeleteAppointment', appointmentId);
        console.log('Appointment data deleted successfully');

        // Disconnect from the gateway
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to delete appointment data: ${error}`);
        throw error;
    }
}

module.exports = { createAppointment, retrieveAppointment, updateAppointment, deleteAppointment };
