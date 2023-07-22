import { gql } from '@apollo/client'

export const getGroupsQuery = gql`
  query getAllGroups($orderBy: Group_orderBy, $orderDirection: Direction) {
    groups(orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      generationFrequency
      description
      name
      specs
      latestSnapshot {
        timestamp
        id
        size
      }
    }
  }
`
