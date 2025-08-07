import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { mintToken } from '../utils/mintToken'
import { revokeAuthorities } from '../utils/revokeAuthority'
import { createSimpleLiquidity } from '../utils/createLiquidity'
import { useWallet } from '@solana/wallet-adapter-react'

export default function TokenForm() {
  const wallet = useWallet()
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [supply, setSupply] = useState('')
  const [website, setWebsite] = useState('')
  const [twitter, setTwitter] = useState('')
  const [telegram, setTelegram] = useState('')
  const [mintAddress, setMintAddress] = useState('')

  const handleMintToken = async () => {
    try {
      const result = await mintToken(wallet, name, symbol, Number(supply), website, twitter, telegram)
      setMintAddress(result.mint.toBase58())
      alert('Token minted successfully!')
    } catch (error) {
      console.error(error)
      alert('Failed to mint token.')
    }
  }

  const handleRevokeAuthorities = async () => {
    if (!mintAddress) {
      alert('Mint address not found.')
      return
    }

    try {
      await revokeAuthorities(wallet, mintAddress)
      alert('Authorities revoked!')
    } catch (error) {
      console.error(error)
      alert('Failed to revoke authorities.')
    }
  }

  const handleCreateLiquidity = async () => {
    if (!mintAddress) {
      alert('Please mint the token first.')
      return
    }

    try {
      const result = await createSimpleLiquidity(wallet, mintAddress)
      console.log('Liquidity added:', result)
      alert('Simulated liquidity added! Check console.')
    } catch (error) {
      console.error('Liquidity error:', error)
      alert('Failed to add liquidity.')
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <input
        type="text"
        placeholder="Token Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Token Symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Total Supply"
        value={supply}
        onChange={(e) => setSupply(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Website (optional)"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Twitter (optional)"
        value={twitter}
        onChange={(e) => setTwitter(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Telegram (optional)"
        value={telegram}
        onChange={(e) => setTelegram(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <Button
        onClick={handleMintToken}
        className="w-full bg-green-600 text-white p-2 rounded-xl"
      >
        Create Token
      </Button>
      {mintAddress && (
        <>
          <Button
            onClick={handleRevokeAuthorities}
            className="w-full bg-red-600 text-white p-2 rounded-xl"
          >
            Revoke Authorities
          </Button>
          <Button
            onClick={handleCreateLiquidity}
            className="w-full bg-blue-600 text-white p-2 rounded-xl"
          >
            Create Raydium Liquidity (Simple)
          </Button>
        </>
      )}
      {mintAddress && (
        <div className="text-sm text-gray-600 mt-2">
          Mint Address: <code>{mintAddress}</code>
        </div>
      )}
    </div>
  )
}
