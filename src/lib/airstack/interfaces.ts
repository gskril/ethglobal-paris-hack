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
}
