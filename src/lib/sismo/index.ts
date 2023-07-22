import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core'
import fetch from 'cross-fetch'
import { SismoGroup, SismoGroupsResponseType } from '@/lib/sismo/interfaces'
import { getGroupsQuery } from '@/lib/sismo/queries'

export class SismoHelper {
  apolloClient: ApolloClient<any>

  constructor() {
    this.apolloClient = new ApolloClient({
      link: new HttpLink({
        uri: 'https://api.sismo.io/',
        fetch,
      }),
      cache: new InMemoryCache(),
    })
  }

  async getGroups(
    options: { orderBy: string; orderDirection: string } = {
      orderBy: 'name',
      orderDirection: 'asc',
    }
  ): Promise<SismoGroup[]> {
    try {
      const response = await this.apolloClient.query<SismoGroupsResponseType>({
        query: getGroupsQuery,
        variables: options,
      })
      return response.data.groups
    } catch (e) {
      console.error('Error while calling Sismo API', e)
      throw e
    }
  }
}
