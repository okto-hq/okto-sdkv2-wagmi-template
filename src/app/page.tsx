'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { CounterContract } from './components/CounterContract'
import { PortfolioBalance } from './components/PortfolioBalance'

function App() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  
  return (
    <>
      <header className="header">
        <h1 className="text-3xl font-bold">Wagmi Okto Template</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Sample Wagmi app with Okto Adapter
        </p>
      </header>
      
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
            
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-3 h-3 rounded-full ${account.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium">Status: {account.status}</span>
              </div>
              
              {account.status === 'connected' && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Address:</strong> 
                    <span className="ml-1 font-mono">{account.addresses?.[0]}</span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Chain ID:</strong> 
                    <span className="ml-1 font-mono">{account.chainId}</span>
                  </p>
                </div>
              )}
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md text-red-600 dark:text-red-400 text-sm">
                  {error.message}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            {account.status === 'connected' ? (
              <button 
                onClick={() => disconnect()}
                className="button button-danger"
              >
                Disconnect Wallet
              </button>
            ) : (
              connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  disabled={status === 'pending'}
                  className="button button-primary"
                >
                  {status === 'pending' ? 'Connecting...' : `Connect with ${connector.name}`}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
      
      {account.status === 'connected' ? (
        <>
          <PortfolioBalance />
          <CounterContract />
        </>
      ) : (
        <div className="card text-center p-8">
          <div className="text-6xl mb-4">👆</div>
          <h3 className="text-xl font-medium mb-2">Connect Your Wallet</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Connect your wallet to interact with the Counter smart contract.
          </p>
        </div>
      )}
    </>
  )
}

export default App
