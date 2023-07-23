import {
  Bubble,
  BubblePrivacyType,
  TokenType,
} from '@/lib/db/interfaces/bubble'
import { User } from '@/lib/db/interfaces/user'
import { AirstackHelper } from '@/lib/airstack'
import { SismoConnectResponse } from '@sismo-core/sismo-connect-server'
import { verifySismoResult } from '@/lib/sismo/sismo-connect'
import { SismoHelper } from '@/lib/sismo'
import { CreateBubbleRequestData } from '@/pages/api/bubbles/index'
import { BadRequestException } from 'next-api-decorators'

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
        bubble.token?.address!,
        bubble.token?.amount!,
        user.address!
      )
    case BubblePrivacyType.ERC_721:
      return ERC721Handler(bubble.token?.address!, user.address!)
    case BubblePrivacyType.ERC_1155:
      return ERC1155Handler(
        bubble.token?.address!,
        bubble.token?.tokenId!,
        user.address!
      )
    case BubblePrivacyType.SISMO:
      return SismoHandler(bubble.sismoGroup?.id!, sismoResponse!)
    case BubblePrivacyType.POAP:
      return POAPHandler(bubble.poapEvent?.id!, user.address!)
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
  tokenId: string,
  walletAddress: string
): Promise<boolean> => {
  const airStack = new AirstackHelper()
  const erc721tokens = await airStack.getERC1155BalanceOfWallet(
    contractAddress,
    tokenId,
    walletAddress
  )
  return erc721tokens?.length >= 0
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
    (proof) => proof.claims?.length! >= 0 || proof.auths?.length! >= 0
  )
}

export const enrichBubble = async (
  privacyType: BubblePrivacyType,
  bubble: Bubble,
  data: Partial<CreateBubbleRequestData>
): Promise<Bubble> => {
  switch (privacyType) {
    case BubblePrivacyType.OPEN:
      return bubble
    case BubblePrivacyType.ERC_20: {
      const airstackHelper = new AirstackHelper()
      const token = await airstackHelper.getERC20orERC721TokenByAddress(
        data.erc20ContractAddress as string
      )
      if (!token) throw new BadRequestException('Invalid ERC20 token')
      bubble.token = {
        address: token.address,
        amount: data.erc20amount,
        metadata: {
          token: {
            name: token.name,
            symbol: token.symbol,
            collectionName: token.projectDetails.collectionName,
            description: token.projectDetails.description,
            discordUrl: token.projectDetails.discordUrl,
            externalUrl: token.projectDetails.externalUrl,
            imageUrl: token.projectDetails.imageUrl,
            twitterUrl: token.projectDetails.twitterUrl,
          },
        },
        tokenId: data.erc1155TokenId as string,
        type: TokenType.ERC_20,
      }
      return bubble
    }
    case BubblePrivacyType.ERC_721: {
      const airstackHelper = new AirstackHelper()
      const token = await airstackHelper.getERC20orERC721TokenByAddress(
        data.erc721ContractAddress as string
      )
      if (!token) throw new BadRequestException('Invalid ERC721 token')
      bubble.token = {
        address: token.address,
        metadata: {
          token: {
            name: token.name,
            symbol: token.symbol,
            collectionName: token.projectDetails.collectionName,
            description: token.projectDetails.description,
            discordUrl: token.projectDetails.discordUrl,
            externalUrl: token.projectDetails.externalUrl,
            imageUrl: token.projectDetails.imageUrl,
            twitterUrl: token.projectDetails.twitterUrl,
          },
        },
        tokenId: data.erc1155TokenId as string,
        type: TokenType.ERC_721,
      }
      return bubble
    }
    case BubblePrivacyType.ERC_1155: {
      const airstackHelper = new AirstackHelper()
      const token = await airstackHelper.getERC1155TokenByAddressAndId(
        data.erc1155ContractAddress as string,
        data.erc1155TokenId as string
      )
      if (!token) throw new BadRequestException('Invalid ERC1155 token')
      token.TokenNft
      bubble.token = {
        address: token.Token.address,
        metadata: {
          token: {
            name: token.Token.name,
            symbol: token.Token.symbol,
            collectionName: token.Token.projectDetails.collectionName,
            description: token.Token.projectDetails.description,
            discordUrl: token.Token.projectDetails.discordUrl,
            externalUrl: token.Token.projectDetails.externalUrl,
            imageUrl: token.Token.projectDetails.imageUrl,
            twitterUrl: token.Token.projectDetails.twitterUrl,
          },
          tokenNft: {
            name: token.TokenNft.metaData.name,
            description: token.TokenNft.metaData.description,
            image: token.TokenNft.metaData.image,
            imageData: token.TokenNft.metaData.imageData,
            backgroundColor: token.TokenNft.metaData.backgroundColor,
            youtubeUrl: token.TokenNft.metaData.youtubeUrl,
            externalUrl: token.TokenNft.metaData.externalUrl,
            animationUrl: token.TokenNft.metaData.animationUrl,
          },
        },
        tokenId: data.erc1155TokenId as string,
        type: TokenType.ERC_1155,
      }
      return bubble
    }
    case BubblePrivacyType.SISMO: {
      const sismoHelper = new SismoHelper()
      const sismoGroup = await sismoHelper.getGroup(data.sismoGroupId as string)
      if (!sismoGroup) throw new BadRequestException('Invalid Sismo Group')
      bubble.sismoGroup = {
        id: sismoGroup.id,
        description: sismoGroup.description,
        name: sismoGroup.name,
        specs: sismoGroup.specs,
      }
      return bubble
    }
    case BubblePrivacyType.POAP: {
      const airstackHelper = new AirstackHelper()
      const poapEvent = await airstackHelper.getPoapByEventId(
        data.poapEventId as string
      )
      if (!poapEvent || poapEvent?.length === 0)
        throw new BadRequestException('POAP event not found')
      bubble.poapEvent = {
        description: poapEvent[0].poapEvent.metadata.description,
        externalUrl: poapEvent[0].poapEvent.metadata.external_url,
        homeUrl: poapEvent[0].poapEvent.metadata.home_url,
        imageUrl: poapEvent[0].poapEvent.metadata.image_url,
        name: poapEvent[0].poapEvent.eventName,
        url: poapEvent[0].poapEvent.eventURL,
        id: data.poapEventId as string,
      }
      return bubble
    }
    case BubblePrivacyType.FARCASTER:
      bubble.farcasterCastHash = data.farcasterCastHash
      break
    default:
      return bubble
  }
  return bubble
}
