const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function setupIcxAsset() {
    try {
        execSync('cargo install icx-asset', { stdio: 'inherit' });
    } catch (error) {
        console.log('icx-asset already installed or error installing:', error.message);
    }
}

async function uploadAssets() {
    const identityPath = path.join(os.homedir(), '.config/dfx/identity/default/identity.pem');
    const canisterId = 'lpp2u-jyaaa-aaaaj-qngka-cai';  // Your frontend canister ID
    
    try {
        // Create a manifest file for assets
        const manifest = {
            version: 1,
            files: [
                { source: "dist/index.html", destination: "/index.html", contentType: "text/html" },
                { source: "dist/367.5fb73d3218ca1e4e0ebd.js", destination: "/367.5fb73d3218ca1e4e0ebd.js", contentType: "application/javascript" },
                { source: "dist/index.2fcf11f872382057f203.js", destination: "/index.2fcf11f872382057f203.js", contentType: "application/javascript" }
            ]
        };

        fs.writeFileSync('asset-manifest.json', JSON.stringify(manifest, null, 2));

        // Upload using icx-asset
        const cmd = `icx-asset --pem ${identityPath} --replica https://ic0.app sync ${canisterId} --manifest asset-manifest.json --verbose`;
        console.log('Executing upload command:', cmd);
        execSync(cmd, { stdio: 'inherit' });

    } catch (error) {
        console.error('Upload failed:', error);
        throw error;
    } finally {
        // Cleanup
        try {
            fs.unlinkSync('asset-manifest.json');
        } catch (e) {
            console.warn('Failed to clean up manifest:', e);
        }
    }
}

async function main() {
    try {
        await setupIcxAsset();
        await uploadAssets();
        console.log('Upload completed successfully!');
    } catch (error) {
        console.error('Error in main:', error);
        process.exit(1);
    }
}

main();