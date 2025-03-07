'use client'

import { useState, useEffect } from 'react'
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
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [animateValue, setAnimateValue] = useState(false)
  const [lastValue, setLastValue] = useState<string | null>(null)
  
  // Read the current counter value
  const { data: counterValue, isError: readError, isLoading: readLoading, refetch } = useReadContract({
    address: COUNTER_ADDRESS,
    abi: COUNTER_ABI,
    functionName: 'number',
  })

  // Write functions using the new API
  const { writeContract, isPending, status, error, data: txHash } = useWriteContract()

  // Handle increment
  const handleIncrement = () => {
    setLastValue(counterValue?.toString() || '0')
    writeContract({
      address: COUNTER_ADDRESS,
      abi: COUNTER_ABI,
      functionName: 'increment',
    })
  }

  // Handle decrement
  const handleDecrement = () => {
    setLastValue(counterValue?.toString() || '0')
    writeContract({
      address: COUNTER_ADDRESS,
      abi: COUNTER_ABI,
      functionName: 'decrement',
    })
  }

  // Handle set number
  const handleSetNumber = () => {
    if (!newValue) return
    
    setLastValue(counterValue?.toString() || '0')
    writeContract({
      address: COUNTER_ADDRESS,
      abi: COUNTER_ABI,
      functionName: 'setNumber',
      args: [BigInt(newValue)],
    })
  }

  // Auto-refresh counter value after transaction
  useEffect(() => {
    if (status === 'success' && txHash) {
      setTransactionHash(txHash)
      const timer = setTimeout(() => {
        refetch()
        setAnimateValue(true)
        setTimeout(() => setAnimateValue(false), 1000)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [status, txHash, refetch])

  const formatChainExplorerLink = (hash: string) => {
    return `https://sepolia.basescan.org/tx/${hash}`
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">Counter Contract</h2>
      
      {/* Contract info */}
      <div className="flex flex-wrap gap-2 items-center mb-6 text-sm text-gray-600 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="flex items-center">
          <span className="font-medium mr-1">Network: Sepolia Base testnet</span>
        </div>
        <div>
          <span className="font-medium mr-1">Contract:</span>
          <a 
            href={`https://sepolia.basescan.org/address/${COUNTER_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-blue-500 hover:text-blue-600 hover:underline"
          >
            {COUNTER_ADDRESS.slice(0, 6)}...{COUNTER_ADDRESS.slice(-4)}
          </a>
        </div>
      </div>
      
      {/* Current value display */}
      <div className="mb-8 p-6 gradient-bg rounded-lg text-center">
        <div className="text-lg font-medium mb-2">Current Counter Value</div>
        {readLoading ? (
          <div className="animate-pulse h-16 bg-gray-200 dark:bg-gray-700 rounded-lg w-32 mx-auto"></div>
        ) : readError ? (
          <div className="text-red-500 font-medium">Error reading contract value</div>
        ) : (
          <div className={`text-5xl font-bold transition-all duration-500 ${animateValue ? 'text-green-500 scale-125' : ''}`}>
            {counterValue?.toString() || '0'}
          </div>
        )}
        <button 
          onClick={() => {
            refetch()
            setAnimateValue(true)
            setTimeout(() => setAnimateValue(false), 1000)
          }} 
          className="mt-4 button button-secondary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Value
        </button>
      </div>
      
      {/* Transaction status */}
      {isPending && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            <span className="font-medium">Transaction in progress...</span>
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">Status: {status}</div>
          <div className="mt-2 text-sm">
            {lastValue !== null && (
              <span>Changing value from <strong>{lastValue}</strong>...</span>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Transaction failed</span>
          </div>
          <div className="mt-2 text-sm text-red-500 dark:text-red-400">{error.message}</div>
        </div>
      )}

      {transactionHash && status === 'success' && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-lg">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Transaction successful!</span>
          </div>
          <div className="mt-2 text-sm">
            <a 
              href={formatChainExplorerLink(transactionHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1"
            >
              View on BaseScan
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Modify Counter</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleIncrement}
            disabled={isPending}
            className="flex-1 py-3 button button-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {isPending ? 'Processing...' : 'Increment (+1)'}
          </button>
          
          <button
            onClick={handleDecrement}
            disabled={isPending}
            className="flex-1 py-3 button button-danger"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
            {isPending ? 'Processing...' : 'Decrement (-1)'}
          </button>
        </div>
      </div>
    </div>
  )
} 