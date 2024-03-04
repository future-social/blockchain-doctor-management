const { Wallets, Gateway } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

async function registerUser() {
    try {
        // Load connection profile
        const ccpPath = path.resolve(__dirname,'..','network', 'connection.json');
        const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
        const ccp = JSON.parse(ccpJSON);

        // Create a new CA client for the organization
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new wallet for the user identity
        const walletPath = path.resolve(__dirname, 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check if the user identity already exists in the wallet
        const userId = process.argv[2];
        const userExists = await wallet.get(userId);
        if (userExists) {
            console.log(`An identity for the user ${userId} already exists in the wallet`);
            return;
        }

        // Enroll the admin user with the CA to use it for registration
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            console.log('Enroll the admin user before registering other users');
            return;
        

        // Register the user identity with the CA
        const registerRequest = {
            enrollmentID: userId,
            affiliation: 'org1.department1', // Specify the affiliation if necessary
            role: 'client', // Specify the role of the user (e.g., client, peer, orderer)
            attrs: [{ name: 'role', value: 'user', ecert: true }] // Additional attributes if needed
        };
        const enrollmentSecret = await ca.register(registerRequest, adminIdentity);
        console.log(`Successfully registered user ${userId} with enrollment secret ${enrollmentSecret}`);

    } catch (error) {
        console.error(`Failed to register user: ${error}`);
        process.exit(1);
    }
}

registerUser();
