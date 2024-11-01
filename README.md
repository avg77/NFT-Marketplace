# NFT Marketplace

This repository hosts the code for an NFT marketplace built with Hardhat for blockchain development and Next.js for the frontend. Follow these steps to set up the project, deploy contracts locally, and configure the environment for testing.

## Prerequisites

- **Node.js** and **npm** installed
- **MetaMask** extension for account management
- **Hardhat** installed globally or locally within the project

**Install Dependencies**  
   Before getting started, install all the dependencies (separate for Back-End and Development Server) via:
   ```bash
   npm install
   ```  

## Getting Started

### 1. Clear Previous Accounts and Hardhat Network

To ensure a fresh start and avoid internal JSON-RPC errors, clear any previously stored accounts or configurations related to Hardhat and MetaMask.

### 2. Start Hardhat Node

Run the following command to start a local Hardhat network:

```bash
npx hardhat node
```
The Hardhat node will initialize and list a set of accounts with their private keys, which can be imported into MetaMask.

### 3. Deploy Contract
Deploy the smart contract to the local Hardhat network:

```bash
npx hardhat run scripts/deploy.js --network localhost
```
This will deploy the contracts and display the contract addresses for reference.

### 4. Start the Development Server
Start the Next.js application:

```bash
npm run dev
```
This will spin up the server, usually accessible at [http://localhost:3000](http://localhost:3000).

### 5. Configure MetaMask for Hardhat Network
In MetaMask, configure a new network with the following details:

- **Network Name**: Hardhat Localhost
- **RPC URL**: `http://127.0.0.1:8545`
- **Chain ID**: `31337`
- **Currency Symbol**: `ETH`

### 6. Import Hardhat Accounts into MetaMask
Using the private keys listed in the Hardhat node terminal, import each account into MetaMask:

1. Open MetaMask and navigate to **Import Account**.
2. Paste the private key for each account.
3. Repeat this for each account you intend to use for testing.

### 7. Refresh the Web Application
Once the accounts are imported, refresh the web application to ensure MetaMask is connected to the Hardhat network.

### 8. Connect Imported Accounts
Connect each of the imported accounts to the application from MetaMask to start testing transactions.

### 9. Prepare Accounts for Transactions
To avoid internal JSON-RPC errors when testing buy, sell, and create functionalities, ensure no previous data is stored in the imported accounts (especially from previous transactions).


