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

export const getERC721TokenBalanceQuery = gql`
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

export const getERC20TokenBalanceQuery = gql`
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

export const getERC1155TokenBalanceQuery = gql`
  query tokens(
    $tokenAddress: Address!
    $tokenId: String!
    $address: Identity!
  ) {
    erc1155: TokenBalances(
      input: {
        filter: {
          owner: { _in: [$address] }
          tokenType: { _in: [ERC1155] }
          tokenAddress: { _eq: $tokenAddress }
          tokenId: { _eq: $tokenId }
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

export const getPoapByEventIdQuery = gql`
  query getPoapByEventId($eventId: String!) {
    Poaps(
      input: {
        filter: { eventId: { _eq: $eventId } }
        blockchain: ALL
        limit: 1
      }
    ) {
      Poap {
        poapEvent {
          eventName
          eventURL
          startDate
          endDate
          metadata
        }
      }
    }
  }
`

export const getTokenQuery = gql`
  query getToken($tokenAddress: Address!) {
    Token(input: { address: $tokenAddress, blockchain: ethereum }) {
      address
      projectDetails {
        collectionName
        description
        discordUrl
        externalUrl
        imageUrl
        twitterUrl
      }
      name
      symbol
      type
    }
  }
`

export const getERC1155TokenQuery = gql`
  query GetERC20($tokenAddress: Address!, $tokenId: String!) {
    Token(input: { address: $tokenAddress, blockchain: ethereum }) {
      address
      projectDetails {
        collectionName
        description
        discordUrl
        externalUrl
        imageUrl
        twitterUrl
      }
      name
      symbol
      type
      tokenNfts {
        tokenId
      }
    }
    TokenNft(
      input: { address: $tokenAddress, tokenId: $tokenId, blockchain: ethereum }
    ) {
      metaData {
        name
        description
        image
        imageData
        backgroundColor
        youtubeUrl
        externalUrl
        animationUrl
      }
    }
  }
`
