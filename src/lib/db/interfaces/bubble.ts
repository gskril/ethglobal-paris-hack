export enum BubblePrivacyType {
  ERC_721 = 'erc721',
  ERC_1155 = 'erc1155',
  ERC_20 = 'erc20',
  SISMO = 'sismo',
  FARCASTER = 'farcaster',
  LENS = 'lens',
  POAP = 'poap',
  OPEN = 'open',
}
export interface Bubble {
  id?: string
  userId: string
  name: string
  slug: string
  privacyType: BubblePrivacyType
  poapEventId?: string
  erc721ContractAddress?: string
  erc1155ContractAddress?: string
  erc1155TokenId?: number
  erc20ContractAddress?: string
  erc20amount?: number
  sismoGroupId?: string
  farcasterCastHash?: string
  dailyRoomId: string
}
