import { Bubble, BubblePrivacyType } from '@/lib/db/interfaces/bubble'
import { User } from '@/lib/db/interfaces/user'
import { AirstackHelper } from '@/lib/airstack'
import { SismoConnectResponse } from '@sismo-core/sismo-connect-server'
import { verifySismoResult } from '@/lib/sismo/sismo-connect'

export const checkBubbleAccess = async (
  bubble: Bubble,
  user: User,
  sismoResponse?: SismoConnectResponse
) => {
  switch (bubble.privacyType) {
    case BubblePrivacyType.OPEN:
      return true
    case BubblePrivacyType.ERC_20:
      return ERC20Handler(
        bubble.erc20ContractAddress!,
        bubble.erc20amount!,
        user.address!
      )
    case BubblePrivacyType.ERC_721:
      return ERC721Handler(bubble.erc721ContractAddress!, user.address!)
    case BubblePrivacyType.ERC_1155:
      return ERC1155Handler(
        bubble.erc1155ContractAddress!,
        bubble.erc1155TokenId!,
        user.address!
      )
    case BubblePrivacyType.SISMO:
      return SismoHandler(bubble.sismoGroupId!, sismoResponse!)
    case BubblePrivacyType.POAP:
      return POAPHandler(bubble.poapEventId!, user.address!)
    case BubblePrivacyType.FARCASTER:
      return !!user.farcasterFName
    case BubblePrivacyType.LENS:
      return !!user.lensHandle
  }
}

const ERC20Handler = async (
  contractAddress: string,
  amount: number,
  walletAddress: string
): Promise<boolean> => {
  const airStack = new AirstackHelper()
  const erc20tokens = await airStack.getERC20BalanceOfWallet(
    contractAddress,
    walletAddress
  )
  if (erc20tokens?.length === 0) return false
  const token = erc20tokens[0]
  return token.formattedAmount >= amount
}

const ERC721Handler = async (
  contractAddress: string,
  walletAddress: string
): Promise<boolean> => {
  const airStack = new AirstackHelper()
  const erc721tokens = await airStack.getERC721BalanceOfWallet(
    contractAddress,
    walletAddress
  )
  return erc721tokens?.length >= 0
}

const ERC1155Handler = async (
  contractAddress: string,
  tokenId: number,
  walletAddress: string
): Promise<boolean> => {
  return true
}

const POAPHandler = async (
  poapEventId: string,
  walletAddress: string
): Promise<boolean> => {
  const airStack = new AirstackHelper()
  const poaps = await airStack.checkPOAPByEventIdAndWallet(
    poapEventId,
    walletAddress
  )
  return poaps?.length >= 0
}

const SismoHandler = async (
  sismoGroupId: string,
  response: SismoConnectResponse
): Promise<boolean> => {
  const verificationResult = await verifySismoResult(
    [{ groupId: sismoGroupId }],
    response
  )
  return verificationResult.response.proofs.every(
    (proof) =>
      proof.claims?.every((claim) => claim.isSelectableByUser) &&
      proof.auths?.every((auth) => auth.isSelectableByUser)
  )
}
