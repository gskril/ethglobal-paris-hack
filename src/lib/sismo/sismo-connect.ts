import {
  SismoConnect,
  SismoConnectConfig,
  SismoConnectResponse,
} from '@sismo-core/sismo-connect-server'
import { SismoConnectVerifiedResult } from '@sismo-core/sismo-connect-react'

const sismoConnectConfig: SismoConnectConfig = {
  appId: process.env.NEXT_PUBLIC_SISMO_APP_ID as string,
}

const sismoConnect = SismoConnect({ config: sismoConnectConfig })
export const verifySismoResult = async (
  groupIds: { groupId: string }[],
  response: SismoConnectResponse
) => {
  return await sismoConnect.verify(response, {
    claims: groupIds,
  })
}
