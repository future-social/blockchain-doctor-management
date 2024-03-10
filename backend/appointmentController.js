const { Wallets, Gateway } = require("fabric-network");
const fs = require("fs");
const path = require("path");
const moment = require('moment');
// const fabricHelper = require('./fabricHelper');

async function createAppointment(appointmentData, doctorId) {
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
        const identity = await wallet.get(doctorId);
        if (!identity) {
          throw new Error(
            "An identity for the user " +
            doctorId +
              " does not exist in the wallet"
          );
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, {
          wallet,
          identity: doctorId,
          discovery: { enabled: true, asLocalhost: true },
        });
    
        // Get the network and contract
        const network = await gateway.getNetwork("medicpro");
        const contract = network.getContract("basic");
    
        // Format Date Parameters
        const formattedAppDate = moment(appointmentData['time'], 'YYYY-MM-DD').format(); // TODO
    
        // Submit the transaction to create a new doctor
        await contract.submitTransaction(
          "CreateAppointment",
          doctorId,
          formattedAppDate,
          appointmentData['name'],
          appointmentData['gender'],
          appointmentData['consulting_department'],
        );
        console.log("Appointment created successfully");
    
        // Disconnect from the gateway
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to create appointment: ${error}`);
        throw error;
    }
}

async function retrieveAppointment(appointmentId, doctorId) {
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
        const identity = await wallet.get(doctorId);
        if (!identity) {
          throw new Error(
            "An identity for the user " + doctorId + " does not exist in the wallet"
          );
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, {
          wallet,
          identity: doctorId,
          discovery: { enabled: true, asLocalhost: true },
        });
    
        // Get the network and contract
        const network = await gateway.getNetwork("medicpro");
        const contract = network.getContract("basic");
    
        // Submit the transaction
        const result = await contract.evaluateTransaction("ViewAppointment", appointmentId);
        console.log(`Appointment retrieved: ${result.toString()}`);
    
        // Disconnect from the gateway
        await gateway.disconnect();
        return result;
    } catch (error) {
        console.error(`Failed to retrieve appointment: ${error}`);
        throw error;
    }
}

async function updateAppointment(appointmentId, updatedData, doctorId) {
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
        const identity = await wallet.get(doctorId);
        if (!identity) {
          throw new Error(
            "An identity for the user " + doctorId + " does not exist in the wallet"
          );
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, {
          wallet,
          identity: doctorId,
          discovery: { enabled: true, asLocalhost: true },
        });
    
        // Get the network and contract
        const network = await gateway.getNetwork("medicpro");
        const contract = network.getContract("basic");
    
        // Format Date Parameters
        const formattedAppDate = moment(updatedData['time'], 'YYYY-MM-DD').format(); // TODO

        // Submit the transaction
        await contract.submitTransaction(
          "UpdateAppointment",
          appointmentId,
          doctorId,
          formattedAppDate,
          updatedData['name'],
          updatedData['gender'],
          updatedData['consulting_department'],
        );
        console.log("Appointment updated successfully");
    
        // Disconnect from the gateway
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to update appointment: ${error}`);
        throw error;
    }
}

async function deleteAppointment(appointmentId, doctorId) {
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
        const identity = await wallet.get(doctorId);
        if (!identity) {
          throw new Error(
            "An identity for the user " +
              doctorId +
              " does not exist in the wallet"
          );
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, {
          wallet,
          identity: doctorId,
          discovery: { enabled: true, asLocalhost: true },
        });
    
        // Get the network and contract
        const network = await gateway.getNetwork("medicpro");
        const contract = network.getContract("basic");
    
        // Submit the transaction to update doctor data
        await contract.submitTransaction("DeleteAppointment", appointmentId);
        console.log("Appointment deleted successfully");
    
        // Disconnect from the gateway
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to delete appointment: ${error}`);
        throw error;
    }
}

module.exports = { createAppointment, retrieveAppointment, updateAppointment, deleteAppointment };
