import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core'
import fetch from 'cross-fetch'

export abstract class GraphQLHelper {
  apolloClient: ApolloClient<any>

  constructor(baseUrl: string) {
    this.apolloClient = new ApolloClient({
      link: new HttpLink({ uri: baseUrl, fetch }),
      cache: new InMemoryCache(),
    })
  }
}
