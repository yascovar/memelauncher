import React from 'react'
import { PublicKey } from '@solana/web3.js'
import { revokeAuthority } from '../utils/revokeAuthority'
import { useWallet } from '@solana/wallet-adapter-react'

const AuthorityButtons = ({ mint }) => {
  const wallet = useWallet()

  const handleRevoke = async (type) => {
    if (!mint || !wallet?.publicKey) return
    try {
      await revokeAuthority(type, new PublicKey(mint), wallet)
      alert(`${type} authority revoked!`)
    } catch (err) {
      console.error(err)
      alert(`Failed to revoke ${type} authority`)
    }
  }

  return (
    <div className="space-y-2 mt-4">
      <button onClick={() => handleRevoke('mint')} className="btn">
        Revoke Mint Authority
      </button>
      <button onClick={() => handleRevoke('freeze')} className="btn">
        Revoke Freeze Authority
      </button>
      <button onClick={() => handleRevoke('update')} className="btn">
        Revoke Update Authority
      </button>
    </div>
  )
}

export default AuthorityButtons
