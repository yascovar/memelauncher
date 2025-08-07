import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  setAuthority,
  AuthorityType
} from '@solana/spl-token'
import { Connection, PublicKey, clusterApiUrl, Keypair } from '@solana/web3.js'

export async function mintToken(wallet, formData) {
  const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed')
  const payer = wallet
  const mint = await createMint(
    connection,
    payer,
    payer.publicKey,
    null,
    9
  )

  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  )

  const supplyAmount = Number(formData.supply) * 10 ** 9

  await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    payer.publicKey,
    supplyAmount
  )

  return mint.toBase58()
}
