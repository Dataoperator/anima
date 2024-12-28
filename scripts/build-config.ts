export const BuildConfig = {
    // Critical files that must be backed up
    criticalFiles: [
        'dfx.json',
        'canister_ids.json',
        'src/lib.rs',
        'src/lib.did'
    ],

    // Build artifacts that must exist after build
    requiredArtifacts: [
        'src/declarations/anima/anima.did',
        'src/declarations/anima/anima.did.d.ts',
        'src/declarations/anima/anima.did.js',
        '.dfx/local/canisters/anima/anima.wasm'
    ],

    // Directories to include in incremental backups
    backupDirs: [
        'src',
        '.dfx/local',
        'build'
    ],

    // Number of days to keep backup files
    backupRetentionDays: 7,

    // Deployment state files
    deploymentStateFiles: [
        'canister_ids.json',
        'dfx.json',
        '.dfx/local/canister_ids.json'
    ],

    // Build process steps
    buildSteps: [
        {
            name: 'clean',
            command: 'rm -rf .dfx dist node_modules'
        },
        {
            name: 'install',
            command: 'npm install'
        },
        {
            name: 'generate',
            command: 'dfx generate anima'
        },
        {
            name: 'compile',
            command: 'cargo build --target wasm32-unknown-unknown --release'
        },
        {
            name: 'build-frontend',
            command: 'npm run build'
        }
    ]
};