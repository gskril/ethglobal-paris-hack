import { Bubble, BubblePrivacyType } from '@/lib/db/interfaces/bubble'
import { User } from '@/lib/db/interfaces/user'

export const checkBubbleAccess = async (bubble: Bubble, user: User) => {
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
      return SismoHandler(bubble.sismoGroupId!, user.address!)
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
  return true
}

const ERC721Handler = async (
  contractAddress: string,
  walletAddress: string
): Promise<boolean> => {
  return true
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
  return true
}

const SismoHandler = async (
  sismoGroupId: string,
  response: any
): Promise<boolean> => {
  return true
}
