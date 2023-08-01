export enum BubbleConditionType {
  ERC_721 = 'erc721',
  ERC_1155 = 'erc1155',
  ERC_20 = 'erc20',
  SISMO = 'sismo',
  FARCASTER = 'farcaster',
  LENS = 'lens',
  POAP = 'poap',
  OPEN = 'open',
}

export interface BubbleCondition {
  type: BubbleConditionType
  poapEvent?: {
    id: string
    name: string
    url: string
    imageUrl: string
    externalUrl: string
    homeUrl: string
    description: string
  }
  token?: {
    type: TokenType
    address: string
    tokenId?: string
    amount?: number
    metadata?: Record<string, any>
  }
  sismoGroups?: {
    id: string
    description: string
    name: string
    specs: string
  }[]
}

export interface Bubble {
  id?: string
  userId: string
  name: string
  slug: string
  conditions: BubbleCondition[]
  farcasterCastHash?: string
  dailyRoomId?: string
}

export enum TokenType {
  ERC_721 = 'erc721',
  ERC_1155 = 'erc1155',
  ERC_20 = 'erc20',
}

export interface TokenDetails {
  collectionName: string
  externalUrl: string
  discordUrl: string
  description: string
  imageUrl: string
  twitterUrl: string
}
