import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token"
import { Connection } from "@solana/web3.js"

export async function mintToken(wallet, name, symbol, supply, website, twitter, telegram) {
  if (!wallet.publicKey) throw new Error("Wallet not connected")

  const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed")
  const payer = wallet

  // Create mint
  const mint = await createMint(
    connection,
    payer,
    payer.publicKey,
    null,
    9 // Decimals
  )

  // Create associated token account
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  )

  // Mint tokens to wallet
  await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    payer.publicKey,
    supply * 10 ** 9 // Convert to base units
  )

  console.log("✅ Token minted successfully!")
  console.log("Name:", name)
  console.log("Symbol:", symbol)
  console.log("Total Supply:", supply)
  console.log("Website:", website)
  console.log("Twitter:", twitter)
  console.log("Telegram:", telegram)
  console.log("Mint Address:", mint.toBase58())

  return { mint }
}
