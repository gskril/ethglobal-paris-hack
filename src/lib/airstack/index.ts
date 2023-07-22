import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core'
import fetch from 'cross-fetch'

import {
  AirstackPOAPResponseType,
  AirstackWeb3SocialResponseType,
} from '@/lib/airstack/interfaces'
import { POAPQuery, getWeb3SocialsQuery } from '@/lib/airstack/queries'

export class AirstackHelper {
  apolloClient: ApolloClient<any>

  constructor() {
    this.apolloClient = new ApolloClient({
      link: new HttpLink({
        uri: 'https://api.airstack.xyz/gql',
        fetch,
        headers: { authorization: process.env.AIRSTACK_API_KEY as string },
      }),
      cache: new InMemoryCache(),
    })
  }

  async getWeb3SocialsForAddress(address: string) {
    try {
      const response =
        await this.apolloClient.query<AirstackWeb3SocialResponseType>({
          query: getWeb3SocialsQuery,
          variables: { address },
        })
      return response.data.Socials.Social
    } catch (e) {
      console.error('Error while calling Airstack API', e)
      throw e
    }
  }

  async checkPOAPByEventIdAndWallet(eventId: string, address: string) {
    try {
      const response = await this.apolloClient.query<AirstackPOAPResponseType>({
        query: POAPQuery,
        variables: { owner: address, eventId },
      })
      return response.data.Poaps.Poap
    } catch (e) {
      console.error('Error while calling Airstack API', e)
      throw e
    }
  }
}
