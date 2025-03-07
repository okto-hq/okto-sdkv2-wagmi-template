import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import { type ReactNode } from 'react'
import { cookieToInitialState } from 'wagmi'

import { getConfig } from '../wagmi'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Web3 Counter App',
  description: 'A decentralized counter application built with Next.js and Wagmi',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3b82f6',
}

export default function RootLayout(props: { children: ReactNode }) {
  const initialState = cookieToInitialState(
    getConfig(),
    headers().get('cookie'),
  )
  return (
    <html lang="en">
      <head>
        <script src="https://accounts.google.com/gsi/client" async defer />
      </head>
      <body className={inter.className}>
        <Providers initialState={initialState}>
          <main className="container py-8">
            {props.children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
