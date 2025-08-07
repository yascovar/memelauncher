import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import WalletConnectionProvider from './WalletConnectionProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WalletConnectionProvider>
      <App />
    </WalletConnectionProvider>
  </React.StrictMode>
)
