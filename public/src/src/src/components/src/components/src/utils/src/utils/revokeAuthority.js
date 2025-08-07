import {
  AuthorityType,
  setAuthority,
} from "@solana/spl-token"
import { Connection, PublicKey } from "@solana/web3.js"

export async function revokeAuthority(wallet, mintAddress, type) {
  if (!wallet.publicKey) throw new Error("Wallet not connected")

  const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed")
  const payer = wallet
  const mintPublicKey = new PublicKey(mintAddress)

  let authorityType
  switch (type) {
    case "mint":
      authorityType = AuthorityType.MintTokens
      break
    case "freeze":
      authorityType = AuthorityType.FreezeAccount
      break
    case "update":
      authorityType = AuthorityType.AuthorityType
      break
    default:
      throw new Error("Invalid authority type")
  }

  await setAuthority(
    connection,
    payer,
    mintPublicKey,
    payer.publicKey,
    authorityType,
    null // revoke = set to null
  )

  console.log(`✅ Revoked ${type} authority`)
}
