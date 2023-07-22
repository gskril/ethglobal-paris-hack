import { TokenType } from '@/lib/db/interfaces/bubble'

export interface AirstackWeb3SocialResponseType {
  Socials: {
    Social: AirstackWeb3Social[]
  }
  XMTPs: {
    XMTP: {
      isXMTPEnabled: boolean
      owner: {
        identity: string
      }
    }[]
  }
}

export interface AirstackWeb3Social {
  blockchain: string
  dappName: string
  profileName: string
  userAssociatedAddresses: string[]
  userId: string
  userCreatedAtBlockTimestamp: string
}

export interface AirstackPOAPResponseType {
  Poaps: {
    Poap: AirstackPOAP[]
  }
}

export interface AirstackPOAP {
  eventId: string
  poapEvent: {
    eventName: string
    eventURL: string
    startDate: string
    endDate: string
    metadata: {
      description: string
      external_url: string
      home_url: string
      image_url: string
      name: string
      tags: string[]
      year: number
    }
  }
  owner: {
    identity: string
    addresses: string[]
  }
}

export interface AirstackERC721TokenResponseType {
  erc721: {
    data: AirstackERC721Token[]
  }
}

export interface AirstackERC721Token {
  amount: number
  id: string
  tokenAddress: string
  tokenId: string
  tokenType: 'ERC721'
  token: {
    name: string
    symbol: string
  }
  contractMetadata: {
    image: string
    description: string
    externalLink: string
    name: string
  }
  projectDetails: {
    collectionName: string
    description: string
    discordUrl: string
    externalUrl: string
    imageUrl: string
    twitterUrl: string
  }
}

export interface AirstackERC20TokenResponseType {
  erc20: {
    data: AirstackERC20Token[]
  }
}

export interface AirstackERC20Token {
  amount: string
  formattedAmount: number
  chainId: string
  id: string
  tokenAddress: string
  tokenId: string
  tokenType: 'ERC20'
  token: {
    name: string
    symbol: string
  }
  projectDetails: {
    collectionName: string
    externalUrl: string
    discordUrl: string
    description: string
    imageUrl: string
    twitterUrl: string
  }
}

export interface AirstackERC1155TokenResponseType {
  erc1155: {
    data: AirstackERC1155Token[]
  }
}

export interface AirstackERC1155Token {
  amount: string
  formattedAmount: number
  chainId: string
  id: string
  tokenAddress: string
  tokenId: string
  tokenType: 'ERC1155'
  token: {
    name: string
    symbol: string
  }
  projectDetails: {
    collectionName: string
    externalUrl: string
    discordUrl: string
    description: string
    imageUrl: string
    twitterUrl: string
  }
}

export interface AirstackERC20orERC721TokenResponseType {
  Token: {
    address: string
    projectDetails: {
      collectionName: string
      description: string
      discordUrl: string
      externalUrl: string
      imageUrl: string
      twitterUrl: string
    }
    name: string
    symbol: string
    type: TokenType
  }
}

export interface AirstackERC1155TokenResponseType {
  Token: {
    address: string
    projectDetails: {
      collectionName: string
      description: string
      discordUrl: string
      externalUrl: string
      imageUrl: string
      twitterUrl: string
    }
    name: string
    symbol: string
    type: TokenType
  }
  TokenNft: {
    metaData: {
      name: string
      description: string
      image: string
      imageData: string
      backgroundColor: string
      youtubeUrl: string
      externalUrl: string
      animationUrl: string
    }
  }
}
