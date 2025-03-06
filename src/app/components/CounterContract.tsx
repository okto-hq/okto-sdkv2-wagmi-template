'use client'

import { useState } from 'react'
import { useReadContract, useWriteContract } from 'wagmi'

// Contract address from your deployment on Base Sepolia
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

export function CounterContract() {
  const [newValue, setNewValue] = useState<string>('')
  
  // Read the current counter value
  const { data: counterValue, isError: readError, isLoading: readLoading, refetch } = useReadContract({
    address: COUNTER_ADDRESS,
    abi: COUNTER_ABI,
    functionName: 'number',
  })

  // Write functions using the new API
  const { writeContract, isPending, status, error } = useWriteContract()

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
    <div className="p-6 border rounded-lg shadow-sm bg-white">
      <h2 className="text-2xl font-bold mb-4">Counter Contract</h2>
      
      {/* Contract info */}
      <div className="mb-4 text-sm text-gray-600">
        <div>Network: Base Sepolia Testnet</div>
        <div>Contract Address: <span className="font-mono">{COUNTER_ADDRESS}</span></div>
      </div>
      
      {/* Current value display */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-lg font-medium">Current Value: </div>
        {readLoading ? (
          <div className="animate-pulse h-8 bg-gray-200 rounded w-16 mt-1"></div>
        ) : readError ? (
          <div className="text-red-500">Error reading contract value</div>
        ) : (
          <div className="text-3xl font-bold">{counterValue?.toString() || '0'}</div>
        )}
        <button 
          onClick={() => refetch()} 
          className="mt-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        >
          Refresh Value
        </button>
      </div>
      
      {/* Transaction status */}
      {isPending && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-medium">Transaction in progress...</div>
          <div className="text-sm text-gray-600">Status: {status}</div>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-500">
          <div className="font-medium">Transaction failed</div>
          <div className="text-sm">{error.message}</div>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleIncrement}
          disabled={isPending}
          className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:bg-blue-300 transition"
        >
          {isPending ? 'Processing...' : 'Increment (+1)'}
        </button>
        
        <button
          onClick={handleDecrement}
          disabled={isPending}
          className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded disabled:bg-red-300 transition"
        >
          {isPending ? 'Processing...' : 'Decrement (-1)'}
        </button>
      </div>
      
      {/* Set value form */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="font-medium mb-2">Set Custom Value</div>
        <div className="flex gap-2">
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Enter new value"
            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            onClick={handleSetNumber}
            disabled={isPending || !newValue}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded disabled:bg-green-300 transition"
          >
            {isPending ? 'Processing...' : 'Set Value'}
          </button>
        </div>
      </div>
    </div>
  )
} 