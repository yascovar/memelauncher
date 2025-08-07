import {
  TOKEN_PROGRAM_ID,
  AuthorityType,
  createSetAuthorityInstruction
} from '@solana/spl-token'
import {
  Connection,
  Transaction,
  sendAndConfirmTransaction
} from '@solana/web3.js'

const connection = new Connection('https://api.mainnet-beta.solana.com')

export const revokeAuthority = async (type, mintAddress, wallet) => {
  const authorityTypeMap = {
    mint: AuthorityType.MintTokens,
    freeze: AuthorityType.FreezeAccount,
    update: AuthorityType.AccountOwner
  }

  const tx = new Transaction()
  const revokeIx = createSetAuthorityInstruction(
    mintAddress,
    wallet.publicKey,
    authorityTypeMap[type],
    null,
    [],
    TOKEN_PROGRAM_ID
  )

  tx.add(revokeIx)

  const signed = await wallet.signTransaction(tx)
  await sendAndConfirmTransaction(connection, signed, [wallet.adapter])
}
