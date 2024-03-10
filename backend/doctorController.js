const { Wallets, Gateway } = require("fabric-network");
const fs = require("fs");
const path = require("path");
const moment = require('moment');

async function createDoctor(doctorData, DMSAdminId) {
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

    // Format Date Parameters
    const formattedBirthDate = moment(doctorData['birth_date'], 'YYYY-MM-DD').format(); 
    const formattedRecognizeDate = moment(doctorData['recognize_date'], 'YYYY-MM-DD').format(); 

    // Submit the transaction to create a new doctor
    await contract.submitTransaction(
      "CreateDoctor",
      doctorData['doctor_id'],
      doctorData['first_name'],
      doctorData['last_name'],
      doctorData['ic_no'],
      doctorData['gender'],
      formattedBirthDate,
      doctorData['mobile_number'],
      doctorData['email'],
      doctorData['address'],
      doctorData['specialisation'],
      doctorData['degree'],
      formattedRecognizeDate,
      doctorData['country'],
      doctorData['institution'],
      doctorData['body_granting_qualifications'],
      doctorData['certificate']
    );
    console.log("Doctor data created successfully");

    // Disconnect from the gateway
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to create doctor data: ${error}`);
    throw error;
  }
}

async function retrieveAllDoctor(DMSAdminId) {
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

    // Submit the transaction to retrieve doctor data by ID
    const result = await contract.evaluateTransaction("GetAllDoctors");
    console.log(`Doctor data retrieved: ${result.toString()}`);

    // Parse the result as JSON
    const doctorData = JSON.parse(result.toString());
    // Disconnect from the gateway
    await gateway.disconnect();
    return doctorData;
  } catch (error) {
    console.error(`Failed to retrieve doctor data: ${error}`);
    throw error;
  }
}

async function retrieveDoctor(doctorId) {
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

    // Submit the transaction to retrieve doctor data by ID
    const result = await contract.evaluateTransaction("ViewDoctor", doctorId);
    console.log(`Doctor data retrieved: ${result.toString()}`);

    // Disconnect from the gateway
    await gateway.disconnect();
    return result;
  } catch (error) {
    console.error(`Failed to retrieve doctor data: ${error}`);
    throw error;
  }
}

async function updateDoctor(userId, doctorId, updatedData) {
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
    const identity = await wallet.get(userId);
    if (!identity) {
      throw new Error(
        "An identity for the user " + userId + " does not exist in the wallet"
      );
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: userId,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network and contract
    const network = await gateway.getNetwork("medicpro");
    const contract = network.getContract("basic");

    // Submit the transaction to update doctor data
    await contract.submitTransaction(
      "UpdateDoctor",
      doctorData['doctor_id'],
      doctorData['first_name'],
      doctorData['last_name'],
      doctorData['ic_no'],
      doctorData['gender'],
      formattedBirthDate,
      doctorData['mobile_number'],
      doctorData['email'],
      doctorData['address'],
      doctorData['specialisation'],
      doctorData['degree'],
      formattedRecognizeDate,
      doctorData['country'],
      doctorData['institution'],
      doctorData['body_granting_qualifications'],
      doctorData['certificate']
    );
    console.log("Doctor data updated successfully");

    // Disconnect from the gateway
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to update doctor data: ${error}`);
    throw error;
  }
}

async function deleteDoctor(doctorId, DMSAdminId) {
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

    // Submit the transaction to update doctor data
    await contract.submitTransaction("DeleteDoctor", doctorId);
    console.log("Doctor data deleted successfully");

    // Disconnect from the gateway
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to delete doctor data: ${error}`);
    throw error;
  }
}

module.exports = {
  createDoctor,
  retrieveAllDoctor,
  retrieveDoctor,
  updateDoctor,
  deleteDoctor,
};