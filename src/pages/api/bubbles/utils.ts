import {
  Bubble,
  BubbleCondition,
  BubbleConditionType,
  TokenType,
} from '@/lib/db/interfaces/bubble'
import { User } from '@/lib/db/interfaces/user'
import { AirstackHelper } from '@/lib/airstack'
import { SismoConnectResponse } from '@sismo-core/sismo-connect-server'
import { verifySismoResult } from '@/lib/sismo/sismo-connect'
import { SismoHelper } from '@/lib/sismo'
import { BubbleConditionDTO } from '@/pages/api/bubbles/index'
import { BadRequestException } from 'next-api-decorators'
import { SismoGroup } from '@/lib/sismo/interfaces'

/**
 * Check if the user has access to the bubble
 * @param bubble - Bubble to check
 * @param user - User to check
 * @param sismoResponse - Sismo response to check (optional)
 */
export const checkBubbleAccess = async (
  bubble: Bubble,
  user: User,
  sismoResponse?: SismoConnectResponse
): Promise<boolean> => {
  const conditions = bubble.conditions
  if (!conditions || conditions.length === 0) {
    return true
  }
  // TODO: Once one condition is true, we can stop checking the others
  const checkResults = await Promise.all(
    conditions.map((condition) =>
      checkBubbleCondition(condition, user, sismoResponse)
    )
  )
  return checkResults.some((result) => result)
}

/**
 * Check if the user has access to a specific bubble condition
 * @param bubbleCondition - Bubble condition to check
 * @param user - User to check
 * @param sismoResponse - Sismo response to check (optional)
 */
export const checkBubbleCondition = async (
  bubbleCondition: BubbleCondition,
  user: User,
  sismoResponse?: SismoConnectResponse
): Promise<boolean> => {
  switch (bubbleCondition.type) {
    case BubbleConditionType.OPEN:
      return true
    case BubbleConditionType.ERC_20:
      return ERC20Handler(
        bubbleCondition.token?.address!,
        bubbleCondition.token?.amount!,
        user.address!
      )
    case BubbleConditionType.ERC_721:
      return ERC721Handler(bubbleCondition.token?.address!, user.address!)
    case BubbleConditionType.ERC_1155:
      return ERC1155Handler(
        bubbleCondition.token?.address!,
        bubbleCondition.token?.tokenId!,
        user.address!
      )
    case BubbleConditionType.SISMO:
      return SismoHandler(
        bubbleCondition.sismoGroups!.map((sismoGroup) => sismoGroup.id),
        sismoResponse!
      )
    case BubbleConditionType.POAP:
      return POAPHandler(bubbleCondition.poapEvent?.id!, user.address!)
    case BubbleConditionType.FARCASTER:
      return !!user.farcasterFName
    case BubbleConditionType.LENS:
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
  sismoGroupIds: string[],
  response: SismoConnectResponse
): Promise<boolean> => {
  const verificationResult = await verifySismoResult(
    sismoGroupIds.map((sismoGroupId) => ({ groupId: sismoGroupId })),
    response
  )
  return verificationResult.response.proofs.every(
    (proof) => proof.claims?.length! >= 0 || proof.auths?.length! >= 0
  )
}

export const enrichBubbleConditions = async (
  conditions: BubbleConditionDTO[]
): Promise<BubbleCondition[]> => {
  return await Promise.all(
    conditions.map((condition) => enrichBubbleCondition(condition))
  )
}

export const enrichBubbleCondition = async (
  condition: BubbleConditionDTO
): Promise<BubbleCondition> => {
  const enrichedCondition: BubbleCondition = {
    type: condition.type,
  }
  switch (condition.type) {
    case BubbleConditionType.OPEN:
      return condition
    case BubbleConditionType.ERC_20: {
      const airstackHelper = new AirstackHelper()
      const token = await airstackHelper.getERC20orERC721TokenByAddress(
        condition.contractAddress as string
      )
      if (!token) throw new BadRequestException('Invalid ERC20 token')
      enrichedCondition.token = {
        address: token.address,
        amount: condition.amount,
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
        type: TokenType.ERC_20,
      }
      return enrichedCondition
    }
    case BubbleConditionType.ERC_721: {
      const airstackHelper = new AirstackHelper()
      const token = await airstackHelper.getERC20orERC721TokenByAddress(
        condition.contractAddress as string
      )
      if (!token) throw new BadRequestException('Invalid ERC721 token')
      enrichedCondition.token = {
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
        type: TokenType.ERC_721,
      }
      return enrichedCondition
    }
    case BubbleConditionType.ERC_1155: {
      const airstackHelper = new AirstackHelper()
      const token = await airstackHelper.getERC1155TokenByAddressAndId(
        condition.contractAddress as string,
        condition.tokenId as string
      )
      if (!token) throw new BadRequestException('Invalid ERC1155 token')
      token.TokenNft
      enrichedCondition.token = {
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
        tokenId: condition.tokenId as string,
        type: TokenType.ERC_1155,
      }
      return enrichedCondition
    }
    case BubbleConditionType.SISMO: {
      if (condition.sismoGroupIds?.length === 0) {
        throw new BadRequestException(
          'Condition of type Sismo must include at least a groupId'
        )
      }
      const sismoHelper = new SismoHelper()
      const sismoGroups: SismoGroup[] = await Promise.all(
        (condition?.sismoGroupIds as string[])?.map(
          async (sismoGroupId) => await sismoHelper.getGroup(sismoGroupId)
        )
      )
      if (!sismoGroups) throw new BadRequestException('Invalid Sismo Group')
      enrichedCondition.sismoGroups = sismoGroups.map((sismoGroup) => ({
        id: sismoGroup.id,
        description: sismoGroup.description,
        name: sismoGroup.name,
        specs: sismoGroup.specs,
      }))
      return enrichedCondition
    }
    case BubbleConditionType.POAP: {
      const airstackHelper = new AirstackHelper()
      const poapEvent = await airstackHelper.getPoapByEventId(
        condition.poapEventId as string
      )
      if (!poapEvent || poapEvent?.length === 0)
        throw new BadRequestException('POAP event not found')
      enrichedCondition.poapEvent = {
        description: poapEvent[0].poapEvent.metadata.description,
        externalUrl: poapEvent[0].poapEvent.metadata.external_url,
        homeUrl: poapEvent[0].poapEvent.metadata.home_url,
        imageUrl: poapEvent[0].poapEvent.metadata.image_url,
        name: poapEvent[0].poapEvent.eventName,
        url: poapEvent[0].poapEvent.eventURL,
        id: condition.poapEventId as string,
      }
      return enrichedCondition
    }
    default:
      return enrichedCondition
  }
}
