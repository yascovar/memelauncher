import React, { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { mintToken } from "../utils/mintToken"
import { revokeAllAuthorities } from "../utils/revokeAuthority"
import { createLiquidity } from "../utils/createLiquidity"

export default function TokenForm() {
  const wallet = useWallet()
  const [name, setName] = useState("")
  const [symbol, setSymbol] = useState("")
  const [supply, setSupply] = useState("")
  const [website, setWebsite] = useState("")
  const [twitter, setTwitter] = useState("")
  const [telegram, setTelegram] = useState("")
  const [fee, setFee] = useState("")
  const [mint, setMint] = useState(null)
  const [isTrusted, setIsTrusted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleMint = async () => {
    if (!wallet.connected) {
      alert("Connect your wallet first.")
      return
    }

    setIsLoading(true)
    setMessage("Creating token...")

    try {
      const { mint } = await mintToken(
        wallet,
        name,
        symbol,
        supply,
        website,
        twitter,
        telegram,
        fee
      )
      setMint(mint.toBase58())

      // Simulate liquidity creation (mock)
      await createLiquidity(mint.toBase58(), supply, 1)

      setMessage("✅ Token created successfully!")
    } catch (err) {
      console.error(err)
      setMessage("❌ Token creation failed.")
    }

    setIsLoading(false)
  }

  const handleRevokeAll = async () => {
    if (!mint) return alert("Create token first.")

    setMessage("Revoking authorities...")

    try {
      await revokeAllAuthorities(wallet, mint)
      setIsTrusted(true)
      setMessage("✅ All authorities revoked.")
    } catch (err) {
      console.error(err)
      setMessage("❌ Failed to revoke authorities.")
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-xl font-bold text-center">🚀 Launch Your Memecoin</h2>

      <input
        type="text"
        placeholder="Token Name"
        className="w-full border rounded p-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Symbol"
        className="w-full border rounded p-2"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <input
        type="number"
        placeholder="Total Supply (e.g. 1000000000)"
        className="w-full border rounded p-2"
        value={supply}
        onChange={(e) => setSupply(e.target.value)}
      />

      <input
        type="text"
        placeholder="Website (optional)"
        className="w-full border rounded p-2"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />
      <input
        type="text"
        placeholder="Twitter (optional)"
        className="w-full border rounded p-2"
        value={twitter}
        onChange={(e) => setTwitter(e.target.value)}
      />
      <input
        type="text"
        placeholder="Telegram (optional)"
        className="w-full border rounded p-2"
        value={telegram}
        onChange={(e) => setTelegram(e.target.value)}
      />

      <input
        type="number"
        placeholder="Sell Fee (%)"
        className="w-full border rounded p-2"
        value={fee}
        onChange={(e) => setFee(e.target.value)}
      />

      <button
        onClick={handleMint}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        {isLoading ? "Creating..." : "Create Token"}
      </button>

      {mint && (
        <>
          <p className="text-sm break-words">
            ✅ Mint Address: <strong>{mint}</strong>
          </p>
          <button
            onClick={handleRevokeAll}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 mt-2 rounded"
          >
            Revoke All Authorities
          </button>
        </>
      )}

      {isTrusted && (
        <div className="mt-4 px-4 py-3 bg-green-50 border border-green-500 text-green-700 rounded-md">
          ✅ <span className="font-semibold">Trusted Token:</span> All authorities revoked.
        </div>
      )}

      {message && (
        <p className="text-center text-sm font-medium mt-4">{message}</p>
      )}
    </div>
  )
}
