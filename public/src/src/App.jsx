import React from 'react'
import WalletButton from './components/WalletButton'
import TokenForm from './components/TokenForm'

export default function App() {
  return (
    <div style={{ padding: 40, fontFamily: 'Arial, sans-serif', maxWidth: 600, margin: 'auto' }}>
      <h1>🚀 SolNova Memecoin Launcher</h1>
      <WalletButton />
      <TokenForm />
    </div>
  )
}
