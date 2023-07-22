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

export const getGroupQuery = gql`
  query getGroupFromId($groupId: ID!) {
    group(id: $groupId) {
      id
      name
      description
      specs
      generationFrequency
      latestSnapshot {
        id
        size
        timestamp
      }
    }
  }
`
