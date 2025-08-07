import { setAuthority, AuthorityType } from '@solana/spl-token'
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js'

export async function revokeAllAuthorities(wallet, mintAddress) {
  const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed')
  const mintPubkey = new PublicKey(mintAddress)

  for (const type of [
    AuthorityType.MintTokens,
    AuthorityType.FreezeAccount,
    AuthorityType.AccountOwner,
    AuthorityType.CloseAccount
  ]) {
    try {
      await setAuthority(
        connection,
        wallet,
        mintPubkey,
        wallet.publicKey,
        type,
        null
      )
    } catch (err) {
      console.warn(`Skipping ${type}:`, err.message)
    }
  }
}
