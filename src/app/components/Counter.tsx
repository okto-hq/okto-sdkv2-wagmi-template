'use client'

import { useState } from 'react'
import { useReadContract, useWriteContract } from 'wagmi'

// TODO: Replace with your deployed contract address on Base Sepolia
// After deployment, update this with the address from your deployment logs
const COUNTER_ADDRESS = '0xf28043a5926a1bf7f90DF838D515C3dbB57da7D3' as `0x${string}`

// ABI for the Counter contract
const COUNTER_ABI = [
  { 
    "inputs": [], 
    "name": "number", 
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], 
    "stateMutability": "view", 
    "type": "function" 
  },
  {
    "inputs": [{"internalType": "uint256", "name": "newNumber", "type": "uint256"}],
    "name": "setNumber",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "increment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decrement",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

export function Counter() {
  const [newValue, setNewValue] = useState<string>('')
  
  // Read the current counter value
  const { data: counterValue, isError: readError, isLoading: readLoading, refetch } = useReadContract({
    address: COUNTER_ADDRESS,
    abi: COUNTER_ABI,
    functionName: 'number',
  })

  // Write functions using the new API
  const { writeContract, isPending } = useWriteContract()

  // Handle increment
  const handleIncrement = () => {
    writeContract({
      address: COUNTER_ADDRESS,
      abi: COUNTER_ABI,
      functionName: 'increment',
    })
  }

  // Handle decrement
  const handleDecrement = () => {
    writeContract({
      address: COUNTER_ADDRESS,
      abi: COUNTER_ABI,
      functionName: 'decrement',
    })
  }

  // Handle set number
  const handleSetNumber = () => {
    if (!newValue) return
    
    writeContract({
      address: COUNTER_ADDRESS,
      abi: COUNTER_ABI,
      functionName: 'setNumber',
      args: [BigInt(newValue)],
    })
  }

  return (
    <div className="p-6 border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Counter Contract</h2>
      
      <div className="mb-4">
        <span>Current Value: </span>
        {readLoading ? (
          <span>Loading...</span>
        ) : readError ? (
          <span>Error reading value</span>
        ) : (
          <span className="font-bold">{counterValue?.toString()}</span>
        )}
        <button 
          onClick={() => refetch()} 
          className="ml-2 px-2 py-1 bg-gray-200 rounded text-sm"
        >
          Refresh
        </button>
      </div>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleIncrement}
          disabled={isPending}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
        >
          {isPending ? 'Processing...' : 'Increment'}
        </button>
        
        <button
          onClick={handleDecrement}
          disabled={isPending}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-red-300"
        >
          {isPending ? 'Processing...' : 'Decrement'}
        </button>
      </div>
      
      <div className="flex gap-2">
        <input
          type="number"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="Enter new value"
          className="px-4 py-2 border rounded"
        />
        
        <button
          onClick={handleSetNumber}
          disabled={isPending || !newValue}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-green-300"
        >
          {isPending ? 'Processing...' : 'Set Value'}
        </button>
      </div>
    </div>
  )
} 