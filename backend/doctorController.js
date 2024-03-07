const { Wallets, Gateway } = require("fabric-network");
const fs = require("fs");
const path = require("path");

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

    // Submit the transaction to create a new doctor
    await contract.submitTransaction(
      "CreateDoctor",
      JSON.stringify(doctorData)
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

    // Disconnect from the gateway
    await gateway.disconnect();
    return result;
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

async function updateDoctor(userId, updatedData) {
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
      doctorId,
      JSON.stringify(updatedData)
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