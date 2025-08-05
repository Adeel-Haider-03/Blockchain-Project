import React, { useState, useEffect } from 'react';
import { AlertCircle, Users, DollarSign, Clock, CheckCircle, XCircle, Wallet, RefreshCw } from 'lucide-react';

const MiniROSCA = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [web3Provider, setWeb3Provider] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Contract state
  const [members, setMembers] = useState([]);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [currentRecipient, setCurrentRecipient] = useState('');
  const [totalPaid, setTotalPaid] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [userPaid, setUserPaid] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [contractBalance, setContractBalance] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  
  // Contract address - you'll need to update this after deploying
  const CONTRACT_ADDRESS = "";
  
  // Contract ABI (simplified for demo)
  const CONTRACT_ABI = [
	{
		"inputs": [],
		"name": "emergencyWithdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "makePayment",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "member",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "MemberRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "cycle",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			}
		],
		"name": "NewCycleStarted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "member",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "cycle",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "PaymentMade",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "cycle",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "PayoutDistributed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_member",
				"type": "address"
			}
		],
		"name": "registerMember",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "currentCycle",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "currentMonth",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "cycleCompleted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "cycleRecipient",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllMembers",
		"outputs": [
			{
				"internalType": "address[5]",
				"name": "",
				"type": "address[5]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getContractBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCurrentCycleInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "cycle",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "totalPaid",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "completed",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCurrentRecipient",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMemberPaymentStatus",
		"outputs": [
			{
				"internalType": "bool[5]",
				"name": "",
				"type": "bool[5]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "member",
				"type": "address"
			}
		],
		"name": "getPaymentStatus",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "GROUP_SIZE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hasPaid",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "isMember",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isROSCAComplete",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "memberCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "memberIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "members",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MONTHLY_CONTRIBUTION",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "totalPaidInCycle",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        setLoading(true);
        setError('');
        
        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        setAccount(accounts[0]);
        setIsConnected(true);
        
        // Initialize ethers
        const { ethers } = window;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        setWeb3Provider(provider);
        
        // Initialize contract
        if (CONTRACT_ADDRESS !== "YOUR_CONTRACT_ADDRESS_HERE") {
          const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
          setContract(contractInstance);
          await loadContractData(contractInstance, accounts[0]);
        }
        
        setSuccess('Wallet connected successfully!');
      } else {
        setError('MetaMask is not installed. Please install MetaMask to use this app.');
      }
    } catch (err) {
      setError('Failed to connect wallet: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load contract data
  const loadContractData = async (contractInstance, userAccount) => {
    try {
      setLoading(true);
      
      // Get basic info
      const owner = await contractInstance.owner();
      const memberCount = await contractInstance.memberCount();
      const allMembers = await contractInstance.getAllMembers();
      const cycleInfo = await contractInstance.getCurrentCycleInfo();
      const paymentStatuses = await contractInstance.getMemberPaymentStatus();
      const balance = await contractInstance.getContractBalance();
      const complete = await contractInstance.isROSCAComplete();
      const isMember = await contractInstance.isMember(userAccount);
      const userPaymentStatus = isMember ? await contractInstance.getPaymentStatus(userAccount) : false;
      
      setIsOwner(owner.toLowerCase() === userAccount.toLowerCase());
      setMemberCount(memberCount.toNumber());
      setMembers(allMembers.filter(addr => addr !== '0x0000000000000000000000000000000000000000'));
      setCurrentCycle(cycleInfo[0].toNumber());
      setCurrentRecipient(cycleInfo[1]);
      setTotalPaid(parseFloat(window.ethers.utils.formatEther(cycleInfo[2])));
      setPaymentStatus(paymentStatuses);
      setContractBalance(parseFloat(window.ethers.utils.formatEther(balance)));
      setIsComplete(complete);
      setUserPaid(userPaymentStatus);
      
    } catch (err) {
      setError('Failed to load contract data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Register a new member (owner only)
  const registerMember = async (memberAddress) => {
    if (!contract || !memberAddress) return;
    
    try {
      setLoading(true);
      setError('');
      
      const tx = await contract.registerMember(memberAddress);
      await tx.wait();
      
      setSuccess('Member registered successfully!');
      await loadContractData(contract, account);
    } catch (err) {
      setError('Failed to register member: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Make payment for a specific member
  const payForMember = async (memberAddress, memberIndex) => {
    if (!contract) return;
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Check if current account matches the member
      if (memberAddress.toLowerCase() !== account.toLowerCase()) {
        // Prompt user to switch accounts
        setError(`Please switch to Member ${memberIndex + 1} account (${memberAddress.slice(0, 12)}...) in MetaMask to make this payment.`);
        
        // Optional: Try to request account switch (this may not work in all cases)
        try {
          await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }]
          });
          
          // Request access to the specific account if possible
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          
          if (accounts[0].toLowerCase() !== memberAddress.toLowerCase()) {
            setError(`Please manually switch to the correct account in MetaMask: ${memberAddress.slice(0, 12)}...${memberAddress.slice(-8)}`);
            return;
          }
          
          setAccount(accounts[0]);
          
        } catch (switchError) {
          setError(`Please switch to Member ${memberIndex + 1} account in MetaMask: ${memberAddress.slice(0, 12)}...${memberAddress.slice(-8)}`);
          return;
        }
      }
      
      // Make the payment
      const tx = await contract.makePayment({
        value: window.ethers.utils.parseEther('1.0')
      });
      
      setSuccess(`Payment initiated for Member ${memberIndex + 1}! Waiting for confirmation...`);
      await tx.wait();
      
      setSuccess(`✅ Payment successful for Member ${memberIndex + 1}! Transaction confirmed.`);
      await loadContractData(contract, account);
      
    } catch (err) {
      if (err.message.includes('Already paid')) {
        setError(`Member ${memberIndex + 1} has already paid for this cycle.`);
      } else if (err.message.includes('Only members')) {
        setError(`This account is not registered as Member ${memberIndex + 1}. Please switch accounts in MetaMask.`);
      } else if (err.message.includes('Must pay exactly')) {
        setError('Payment must be exactly 1 ETH.');
      } else {
        setError(`Payment failed for Member ${memberIndex + 1}: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Make payment (original function - keep for backward compatibility)
  const makePayment = async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      setError('');
      
      const tx = await contract.makePayment({
        value: window.ethers.utils.parseEther('1.0')
      });
      await tx.wait();
      
      setSuccess('Payment made successfully!');
      await loadContractData(contract, account);
    } catch (err) {
      setError('Failed to make payment: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const refreshData = async () => {
    if (contract) {
      await loadContractData(contract, account);
      setSuccess('Data refreshed!');
    }
  };

  // Load ethers when component mounts
  useEffect(() => {
    const loadEthers = async () => {
      if (typeof window.ethereum !== 'undefined') {
        // Load ethers from CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.umd.min.js';
        script.onload = () => {
          console.log('Ethers.js loaded successfully');
        };
        document.head.appendChild(script);
      }
    };
    loadEthers();
  }, []);

  const [newMemberAddress, setNewMemberAddress] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-3 rounded-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">MiniROSCA</h1>
                <p className="text-gray-600">Blockchain-Based Rotating Savings Group</p>
              </div>
            </div>
            
            {!isConnected ? (
              <button
                onClick={connectWallet}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 disabled:opacity-50"
              >
                <Wallet className="w-5 h-5" />
                <span>{loading ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            ) : (
              <div className="text-right">
                <div className="text-sm text-gray-600">Connected Account</div>
                <div className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </div>
                <button
                  onClick={refreshData}
                  className="mt-2 text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            )}
          </div>
          
          {/* Status Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2 mb-4">
              <XCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2 mb-4">
              <CheckCircle className="w-5 h-5" />
              <span>{success}</span>
            </div>
          )}
          
          {CONTRACT_ADDRESS === "YOUR_CONTRACT_ADDRESS_HERE" && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>Please deploy the smart contract and update the CONTRACT_ADDRESS in the code.</span>
            </div>
          )}
        </div>

        {isConnected && CONTRACT_ADDRESS !== "YOUR_CONTRACT_ADDRESS_HERE" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Contract Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Clock className="w-6 h-6" />
                <span>Current Status</span>
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Cycle:</span>
                  <span className="font-semibold">{currentCycle + 1} of 5</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Members Registered:</span>
                  <span className="font-semibold">{memberCount} / 5</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Paid This Cycle:</span>
                  <span className="font-semibold">{totalPaid} ETH</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Contract Balance:</span>
                  <span className="font-semibold">{contractBalance} ETH</span>
                </div>
                
                {currentRecipient && (
                  <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                    <div className="text-sm text-gray-600">Current Recipient:</div>
                    <div className="font-mono text-sm">
                      {currentRecipient.slice(0, 10)}...{currentRecipient.slice(-8)}
                    </div>
                  </div>
                )}
                
                {isComplete && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-green-800 font-semibold">ROSCA Complete!</div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <DollarSign className="w-6 h-6" />
                <span>Actions</span>
              </h2>
              
              {isOwner && memberCount < 5 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Register New Member</h3>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Member address (0x...)"
                      value={newMemberAddress}
                      onChange={(e) => setNewMemberAddress(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => registerMember(newMemberAddress)}
                      disabled={loading || !newMemberAddress}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
              
              {memberCount === 5 && !isComplete && (
                <div>
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Your Payment Status:</div>
                    <div className={`px-3 py-2 rounded-lg text-center font-semibold ${
                      userPaid ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'
                    }`}>
                      {userPaid ? 'Paid ✓' : 'Payment Pending'}
                    </div>
                  </div>
                  
                  {!userPaid && (
                    <button
                      onClick={makePayment}
                      disabled={loading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Pay 1 ETH'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Members List with Individual Pay Buttons */}
        {isConnected && members.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-between">
              <span>Group Members & Payment Actions</span>
              {memberCount === 5 && !isComplete && (
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Click any "Pay as [Member]" button to pay from that account
                </span>
              )}
            </h2>
            <div className="grid gap-4">
              {members.map((member, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-mono text-sm font-semibold">
                          {member.slice(0, 12)}...{member.slice(-8)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {member.toLowerCase() === account.toLowerCase() ? 'Your Connected Account' : 'Member Account'}
                          {currentRecipient.toLowerCase() === member.toLowerCase() && (
                            <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                              Current Recipient
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {/* Payment Status */}
                      <div className="flex items-center space-x-2">
                        {paymentStatus[index] ? (
                          <>
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <span className="text-sm font-semibold text-green-700">Paid ✓</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-6 h-6 text-red-500" />
                            <span className="text-sm font-semibold text-red-600">Pending</span>
                          </>
                        )}
                      </div>
                      
                      {/* Pay Button for Each Member */}
                      {memberCount === 5 && !isComplete && !paymentStatus[index] && (
                        <button
                          onClick={() => payForMember(member, index)}
                          disabled={loading}
                          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 ${
                            member.toLowerCase() === account.toLowerCase()
                              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                              : 'bg-orange-500 hover:bg-orange-600 text-white'
                          }`}
                        >
                          {loading ? 'Processing...' : 
                           member.toLowerCase() === account.toLowerCase() 
                             ? 'Pay 1 ETH (You)' 
                             : `Pay as Member ${index + 1}`
                          }
                        </button>
                      )}
                      
                      {paymentStatus[index] && (
                        <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-semibold">
                          Payment Complete
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Member Details */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Position:</span>
                        <span className="ml-2 font-semibold">Member {index + 1}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Payout Cycle:</span>
                        <span className="ml-2 font-semibold">Cycle {index + 1}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Payment Progress Bar */}
            {memberCount === 5 && !isComplete && (
              <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-indigo-800">Cycle {currentCycle + 1} Progress</span>
                  <span className="text-sm text-indigo-600">{paymentStatus.filter(Boolean).length}/5 Paid</span>
                </div>
                <div className="w-full bg-indigo-200 rounded-full h-3">
                  <div 
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(paymentStatus.filter(Boolean).length / 5) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-sm text-indigo-700">
                  {paymentStatus.filter(Boolean).length === 5 ? 
                    '🎉 All payments received! Payout processing...' :
                    `Waiting for ${5 - paymentStatus.filter(Boolean).length} more payment(s)`
                  }
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniROSCA;