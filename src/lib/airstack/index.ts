import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core'
import fetch from 'cross-fetch'

import { AirstackWeb3SocialResponseType } from '@/lib/airstack/interfaces'
import { getWeb3SocialsQuery } from '@/lib/airstack/queries'

export class AirstackHelper {
  apolloClient: ApolloClient<any>

  constructor(baseUrl: string) {
    this.apolloClient = new ApolloClient({
      link: new HttpLink({ uri: baseUrl, fetch }),
      cache: new InMemoryCache(),
    })
  }

  async getWeb3SocialsForAddress(address: string) {
    const response =
      await this.apolloClient.query<AirstackWeb3SocialResponseType>({
        query: getWeb3SocialsQuery,
        variables: { address },
      })
    return response.data.Socials.Social
  }
}
