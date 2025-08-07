import React, { useState } from "react"
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  setAuthority,
  AuthorityType,
} from "@solana/spl-token"
import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js"
import { useWallet } from "@solana/wallet-adapter-react"
import { checkTrustedToken } from "../utils/checkTrustedToken"

export default function TokenForm() {
  const wallet = useWallet()
  const [name, setName] = useState("")
  const [symbol, setSymbol] = useState("")
  const [supply, setSupply] = useState("")
  const [website, setWebsite] = useState("")
  const [twitter, setTwitter] = useState("")
  const [telegram, setTelegram] = useState("")
  const [sellFee, setSellFee] = useState("")
  const [mintAddress, setMintAddress] = useState("")
  const [isTrusted, setIsTrusted] = useState(false)
  const [loading, setLoading] = useState(false)
  const connection = new Connection("https://api.mainnet-beta.solana.com")

  const handleCreateToken = async () => {
    if (!wallet.connected) {
      alert("Please connect your wallet first")
      return
    }

    setLoading(true)

    try {
      const payer = wallet.adapter.publicKey
      const mint = Keypair.generate()
      const decimals = 9
      const lamports = parseInt(supply) * 10 ** decimals

      const mintTx = new Transaction().add(
        await createMint(
          connection,
          payer,
          payer,
          payer,
          decimals,
          mint
        )
      )

      const signature = await wallet.sendTransaction(mintTx, connection, {
        signers: [mint],
      })
      await connection.confirmTransaction(signature)

      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint.publicKey,
        payer
      )

      await mintTo(
        connection,
        payer,
        mint.publicKey,
        tokenAccount.address,
        payer,
        lamports
      )

      const trusted = await checkTrustedToken(mint.publicKey.toBase58())
      setIsTrusted(trusted)

      const newToken = {
        mint: mint.publicKey.toBase58(),
        name,
        symbol,
        supply,
        sellFee,
        website,
        twitter,
        telegram,
      }

      const existing = JSON.parse(localStorage.getItem("launched_tokens")) || []
      existing.push(newToken)
      localStorage.setItem("launched_tokens", JSON.stringify(existing))

      setMintAddress(mint.publicKey.toBase58())
    } catch (err) {
      console.error("Error creating token:", err)
      alert("Token creation failed")
    }

    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">🚀 Create Your MemeCoin</h1>

      <label className="block mb-2">Token Name</label>
      <input type="text" className="w-full p-2 border rounded mb-4" value={name} onChange={(e) => setName(e.target.value)} />

      <label className="block mb-2">Token Symbol</label>
      <input type="text" className="w-full p-2 border rounded mb-4" value={symbol} onChange={(e) => setSymbol(e.target.value)} />

      <label className="block mb-2">Total Supply</label>
      <input type="number" className="w-full p-2 border rounded mb-4" value={supply} onChange={(e) => setSupply(e.target.value)} />

      <label className="block mb-2">Sell Fee (%)</label>
      <input type="number" step="0.1" className="w-full p-2 border rounded mb-4" value={sellFee} onChange={(e) => setSellFee(e.target.value)} />

      <label className="block mb-2">Website (optional)</label>
      <input type="text" className="w-full p-2 border rounded mb-4" value={website} onChange={(e) => setWebsite(e.target.value)} />

      <label className="block mb-2">Twitter (optional)</label>
      <input type="text" className="w-full p-2 border rounded mb-4" value={twitter} onChange={(e) => setTwitter(e.target.value)} />

      <label className="block mb-2">Telegram (optional)</label>
      <input type="text" className="w-full p-2 border rounded mb-4" value={telegram} onChange={(e) => setTelegram(e.target.value)} />

      <button
        className="w-full bg-blue-600 text-white py-2 rounded mt-2"
        onClick={handleCreateToken}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Token"}
      </button>

      {mintAddress && (
        <div className="mt-4 break-words">
          ✅ Token Created: <strong>{mintAddress}</strong>
        </div>
      )}

      {isTrusted && (
        <div className="mt-4 px-4 py-3 bg-green-50 border border-green-500 text-green-700 rounded-md">
          ✅ <strong>Trusted Token:</strong> All authorities revoked.
        </div>
      )}
    </div>
  )
}
