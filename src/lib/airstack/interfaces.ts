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
