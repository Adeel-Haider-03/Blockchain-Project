# 💸 MiniROSCA – Blockchain-Based Rotating Savings Platform


MiniROSCA is a decentralized financial application that implements a blockchain-powered **Rotating Savings and Credit Association (ROSCA)**. Built using **Solidity** and a **React + Vite frontend**, this dApp enables a small group to collectively save and rotate payouts on a monthly basis—ensuring transparency, trust, and automation through smart contracts.

---

## 🚀 Features

- 🔐 **Smart Contract Logic** (Solidity):
  - Only the owner can register members.
  - Tracks payments per cycle and distributes the full contribution to a rotating member.
  - Automatically initiates the next cycle once all members have paid.
  - Allows emergency withdrawal by the owner.
  - View functions for contract state, payment status, current recipient, and balance.

- 🖥️ **Frontend** (React + Vite + TailwindCSS):
  - Connect with MetaMask to interact with the contract.
  - Display cycle progress, payment status, and contract balance.
  - Owner view: Add members.
  - Member view: Make 1 ETH payments per cycle.
  - Visual feedback via success and error messages.

---  

## 📂 Project Structure  
├── Solidity code.txt  
├── MiniROSCA/ # React frontend with Vite  
│ ├── src/  
│ │ ├── App.jsx # Main entry file  
│ │ ├── MiniROSCA.jsx # Main component for UI & interactions  
│ ├── package.json  
│ ├── index.html  
│ └── vite.config.js  
└── README.md  


---

## 🧪 How It Works

1. **Group Formation**:
   - Owner adds 5 members using Ethereum addresses.
   - When the group is full, cycle 1 begins.

2. **Monthly Contributions**:
   - Each member pays 1 ETH during a cycle.
   - Once all 5 pay, the total (5 ETH) is transferred to the selected member.

3. **Cycle Progression**:
   - Recipients rotate per cycle.
   - After 5 cycles, every member has received a payout once.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Ethers.js, Lucide Icons
- **Backend**: Solidity 0.8.x, Ethereum (tested on local / testnet)
- **Wallet**: MetaMask

---

## 🧾 Deployment Instructions

### 🔧 Smart Contract Deployment

1. Compile and deploy `MiniROSCA.sol` using tools like **Remix**, **Hardhat**, or **Foundry**.
2. Copy the deployed contract address.
3. Replace `YOUR_CONTRACT_ADDRESS_HERE` in `MiniROSCA.jsx` with your deployed address.

---

### ⚙️ Frontend Setup

```bash
cd MiniROSCA

# Install dependencies
npm install

# Start local development server
npm run dev


