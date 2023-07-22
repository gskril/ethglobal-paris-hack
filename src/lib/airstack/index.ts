import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core'
import fetch from 'cross-fetch'

import {
  AirstackERC1155TokenResponseType,
  AirstackERC20orERC721TokenResponseType,
  AirstackERC20TokenResponseType,
  AirstackERC721TokenResponseType,
  AirstackPOAPResponseType,
  AirstackWeb3SocialResponseType,
} from '@/lib/airstack/interfaces'
import {
  getERC1155TokenBalanceQuery,
  getERC1155TokenQuery,
  getERC20TokenBalanceQuery,
  getERC721TokenBalanceQuery,
  getPoapByEventIdQuery,
  getTokenQuery,
  getWeb3SocialsQuery,
  POAPQuery,
} from '@/lib/airstack/queries'
import { TokenType } from '@/lib/db/interfaces/bubble'

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
          variables: { address, identity: address },
        })
      return {
        socials: response.data.Socials.Social,
        xmtp: response.data.XMTPs.XMTP,
      }
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

  async getERC721BalanceOfWallet(tokenAddress: string, address: string) {
    try {
      const response =
        await this.apolloClient.query<AirstackERC721TokenResponseType>({
          query: getERC721TokenBalanceQuery,
          variables: { address, tokenAddress },
        })
      return response.data.erc721.data
    } catch (e) {
      console.error('Error while calling Airstack API', e)
      throw e
    }
  }

  async getERC20BalanceOfWallet(tokenAddress: string, address: string) {
    try {
      const response =
        await this.apolloClient.query<AirstackERC20TokenResponseType>({
          query: getERC20TokenBalanceQuery,
          variables: { address, tokenAddress },
        })
      return response.data.erc20.data
    } catch (e) {
      console.error('Error while calling Airstack API', e)
      throw e
    }
  }

  async getERC1155BalanceOfWallet(
    tokenAddress: string,
    tokenId: string,
    address: string
  ) {
    try {
      const response =
        await this.apolloClient.query<AirstackERC1155TokenResponseType>({
          query: getERC1155TokenBalanceQuery,
          variables: { address, tokenId, tokenAddress },
        })
      return response.data.erc1155.data
    } catch (e) {
      console.error('Error while calling Airstack API', e)
      throw e
    }
  }

  async getPoapByEventId(eventId: string) {
    try {
      const response = await this.apolloClient.query<AirstackPOAPResponseType>({
        query: getPoapByEventIdQuery,
        variables: { eventId },
      })
      return response.data.Poaps.Poap
    } catch (e) {
      console.error('Error while calling Airstack API', e)
      throw e
    }
  }

  async getERC20orERC721TokenByAddress(tokenAddress: string) {
    try {
      const response =
        await this.apolloClient.query<AirstackERC20orERC721TokenResponseType>({
          query: getTokenQuery,
          variables: { tokenAddress },
        })
      return response.data.Token
    } catch (e) {
      console.error('Error while calling Airstack API', e)
      throw e
    }
  }

  async getERC1155TokenByAddressAndId(tokenAddress: string, tokenId: string) {
    try {
      const response =
        await this.apolloClient.query<AirstackERC1155TokenResponseType>({
          query: getERC1155TokenQuery,
          variables: { tokenAddress, tokenId },
        })
      return response.data
    } catch (e) {
      console.error('Error while calling Airstack API', e)
      throw e
    }
  }
}
