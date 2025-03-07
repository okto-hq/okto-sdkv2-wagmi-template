'use client'

import { useState, useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'

// List of common tokens to check balances for with improved contrast colors
const TOKENS = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    address: null, // Native token
    logoChar: 'Ξ',
    color: '#7B68EE', // Brighter purple for better contrast
    textColor: '#FFFFFF'
  },
  {
    id: 'usdc',
    name: 'USD Coin',
    symbol: 'USDC',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC on Ethereum
    logoChar: 'U',
    color: '#2775CA',
    textColor: '#FFFFFF'
  },
  {
    id: 'usdt',
    name: 'Tether',
    symbol: 'USDT',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT on Ethereum
    logoChar: 'T',
    color: '#26A17B',
    textColor: '#FFFFFF'
  },
  {
    id: 'dai',
    name: 'Dai',
    symbol: 'DAI',
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI on Ethereum
    logoChar: 'D',
    color: '#F5AC37',
    textColor: '#000000' // Black text for yellow background
  }
]

export function PortfolioBalance() {
  const account = useAccount()
  const [isLoading, setIsLoading] = useState(true)
  const [assets, setAssets] = useState<any[]>([])

  // Fetch native ETH balance
  const { 
    data: ethBalanceData, 
    isLoading: ethBalanceLoading 
  } = useBalance({
    address: account.addresses?.[0],
    watch: true,
  })

  // Fetch token balances for each token in our list
  const tokenBalances = TOKENS.slice(1).map(token => {
    const { data, isLoading } = useBalance({
      address: account.addresses?.[0],
      token: token.address as `0x${string}`,
      watch: true,
    })
    return { token, data, isLoading }
  })

  useEffect(() => {
    if (account.status === 'connected') {
      // Check if all balances have loaded
      const allLoaded = !ethBalanceLoading && tokenBalances.every(t => !t.isLoading)
      
      if (allLoaded) {
        // Process the balances
        const assetsList = []
        
        // Add ETH if balance exists
        if (ethBalanceData && parseFloat(ethBalanceData.formatted) > 0) {
          assetsList.push({
            id: 'ethereum',
            name: 'Ethereum',
            symbol: 'ETH',
            amount: parseFloat(ethBalanceData.formatted),
            logoChar: 'Ξ',
            color: '#7B68EE',
            textColor: '#FFFFFF'
          })
        }
        
        // Add token balances if they exist
        tokenBalances.forEach(({ token, data }) => {
          if (data && parseFloat(data.formatted) > 0) {
            assetsList.push({
              id: token.id,
              name: token.name,
              symbol: token.symbol,
              amount: parseFloat(data.formatted),
              logoChar: token.logoChar,
              color: token.color,
              textColor: token.textColor
            })
          }
        })
        
        setAssets(assetsList)
        setIsLoading(false)
      }
    }
  }, [account.status, ethBalanceData, ethBalanceLoading, tokenBalances, account.addresses])

  if (account.status !== 'connected') {
    return null
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">Portfolio Balance</h2>
      
      {/* Assets overview */}
      <div className="mb-6 p-6 gradient-bg rounded-lg text-center">
        <div className="text-lg font-medium mb-2">Your Assets</div>
        {isLoading ? (
          <div className="animate-pulse h-16 bg-gray-200 dark:bg-gray-700 rounded-lg w-32 mx-auto"></div>
        ) : assets.length > 0 ? (
          <div className="text-5xl font-bold">
            {assets.length} {assets.length === 1 ? 'Token' : 'Tokens'}
          </div>
        ) : (
          <div className="text-lg font-medium text-gray-600 dark:text-gray-300">
            No assets found in this wallet
          </div>
        )}
      </div>
      
      {/* Assets list */}
      <div>
        <h3 className="text-lg font-medium mb-3">Asset Details</h3>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse flex items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="ml-3 flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : assets.length > 0 ? (
          <div className="space-y-3">
            {assets.map(asset => (
              <div key={asset.id} className="flex items-center p-3 bg-black dark:bg-gray-800/50 rounded-lg">
                <div 
                  className="h-10 w-10 flex items-center justify-center rounded-full font-bold text-black"
                  style={{ 
                    backgroundColor: asset.color,
                    color: asset.textColor
                  }}
                >
                  {asset.logoChar}
                </div>
                <div className="ml-3 flex-1">
                  <div className="font-medium text-black">{asset.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {asset.amount.toLocaleString('en-US', { maximumFractionDigits: 6 })} {asset.symbol}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-2xl mb-2">💼</div>
            <p>No assets found in this wallet</p>
            <p className="text-sm mt-2">Try connecting a different wallet or network</p>
          </div>
        )}
      </div>
    </div>
  )
} 