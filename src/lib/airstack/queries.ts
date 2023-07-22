import { gql } from '@apollo/client'

export const getWeb3SocialsQuery = gql`
  query GetAllSocials($address: Address!, $identity: Identity!) {
    Socials(
      input: {
        filter: { userAssociatedAddresses: { _eq: $address } }
        blockchain: ethereum
      }
    ) {
      Social {
        blockchain
        dappName
        profileName
        userAssociatedAddresses
        userId
        userCreatedAtBlockTimestamp
      }
    }
    XMTPs(input: { blockchain: ALL, filter: { owner: { _eq: $identity } } }) {
      XMTP {
        isXMTPEnabled
        owner {
          identity
        }
      }
    }
  }
`

export const POAPQuery = gql`
  query CheckAddressPOAP($eventId: String, $owner: Identity) {
    Poaps(
      input: {
        filter: { eventId: { _eq: $eventId }, owner: { _eq: $owner } }
        blockchain: ALL
      }
    ) {
      Poap {
        eventId
        poapEvent {
          eventName
          eventURL
          startDate
          endDate
          metadata
        }
        owner {
          identity
          addresses
        }
      }
    }
  }
`

export const getERC721TokenQuery = gql`
  query tokens($tokenAddress: Address!, $address: Identity!) {
    erc721: TokenBalances(
      input: {
        filter: {
          owner: { _in: [$address] }
          tokenType: { _in: [ERC721] }
          tokenAddress: { _in: [$tokenAddress] }
        }
        limit: 1
        blockchain: ethereum
      }
    ) {
      data: TokenBalance {
        amount
        chainId
        id
        tokenAddress
        tokenId
        tokenType
        token {
          name
          symbol
          contractMetaData {
            image
            description
            externalLink
            name
          }
          projectDetails {
            collectionName
            description
            discordUrl
            externalUrl
            imageUrl
            twitterUrl
          }
        }
        tokenNfts {
          tokenId
          metaData {
            name
          }
          contentValue {
            image {
              medium
              extraSmall
              large
              original
              small
            }
          }
        }
      }
    }
  }
`

export const getERC20TokenQuery = gql`
  query tokens($tokenAddress: Address!, $address: Identity!) {
    erc20: TokenBalances(
      input: {
        filter: {
          owner: { _in: [$address] }
          tokenType: { _in: [ERC20] }
          tokenAddress: { _in: [$tokenAddress] }
        }
        limit: 10
        blockchain: ethereum
      }
    ) {
      data: TokenBalance {
        amount
        formattedAmount
        chainId
        id
        tokenAddress
        tokenId
        tokenType
        token {
          name
          symbol
          projectDetails {
            collectionName
            description
            discordUrl
            externalUrl
            imageUrl
            twitterUrl
          }
        }
      }
    }
  }
`
