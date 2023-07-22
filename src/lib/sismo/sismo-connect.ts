import {
  SismoConnect,
  SismoConnectServerConfig,
  SismoConnectResponse,
} from '@sismo-core/sismo-connect-server'
import { SismoConnectVerifiedResult } from '@sismo-core/sismo-connect-react'

const sismoConnectConfig: SismoConnectServerConfig = {
  appId: process.env.SISMO_APP_ID as string,
  devMode: {
    enabled: true,
  },
}

const sismoConnect = SismoConnect(sismoConnectConfig)
export const verifySismoResult = async (
  groupIds: { groupId: string }[],
  response: SismoConnectResponse
) => {
  return await sismoConnect.verify(response, {
    claims: groupIds,
    signature: { message: response.signedMessage as string },
  })
}
