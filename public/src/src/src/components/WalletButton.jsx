import React, { useEffect, useState } from 'react'

export default function WalletButton() {
  const [walletAddress, setWalletAddress] = useState(null)

  const connectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect()
        setWalletAddress(response.publicKey.toString())
      } catch (err) {
        console.error('Wallet connection error:', err)
      }
    }
  }

  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      window.solana.connect({ onlyIfTrusted: true }).then(({ publicKey }) => {
        setWalletAddress(publicKey.toString())
      }).catch(() => {})
    }
  }, [])

  return (
    <div>
      {walletAddress ? (
        <p>✅ Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
      ) : (
        <button onClick={connectWallet}>Connect Phantom Wallet</button>
      )}
    </div>
  )
}
