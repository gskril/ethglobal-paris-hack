import { gql } from '@apollo/client'

export const getWeb3SocialsQuery = gql`
  query GetAllSocials($address: String!) {
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
  }
`
