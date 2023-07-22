export interface AirstackWeb3SocialResponseType {
  Socials: {
    Social: AirstackWeb3Social[]
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
    eventName: 'DevCon2'
    eventURL: 'https://devcon.ethereum.org/'
    startDate: '2016-09-19T00:00:00Z'
    endDate: '2016-09-21T00:00:00Z'
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
