import { useGlobalContext } from '@/hooks/useGlobalContext'
import { Bubble } from '@/lib/db/interfaces/bubble'
import {
  SismoConnectButton,
  SismoConnectConfig,
  SismoConnectResponse,
} from '@sismo-core/sismo-connect-react'
import axios from 'axios'
import { useState } from 'react'

export function SismoConnect({
  bubble,
  setIsAuthed,
  setDailyToken,
}: {
  bubble: Bubble
  setIsAuthed: (isAuthed: boolean) => void
  setDailyToken: (token: string) => void
}) {
  const { token } = useGlobalContext()

  const sismoConnectConfig: SismoConnectConfig = {
    appId: process.env.NEXT_PUBLIC_SISMO_APP_ID!,
  }

  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [hasSentRequest, setHasSentRequest] = useState(false)

  const verify = async (response: SismoConnectResponse) => {
    console.log(response)
    setVerifying(true)
    try {
      const accessRes = await axios.post(
        `/api/bubbles/${bubble.id}/access`,
        {
          sismoResponse: response,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setIsVerified(true)
      setIsAuthed(true)
      setDailyToken(accessRes.data.accessToken)
    } catch (e) {
      setError('Invalid response')
      console.error(e)
    } finally {
      setVerifying(false)
    }
  }

  if (!isVerified) {
    console.log(bubble.sismoGroup?.id)

    return (
      <>
        <SismoConnectButton
          config={sismoConnectConfig}
          claims={[{ groupId: bubble.sismoGroup?.id! }]}
          onResponse={(response: SismoConnectResponse) => {
            if (!hasSentRequest) {
              verify(response)
              setHasSentRequest(true)
            }
          }}
          verifying={verifying}
          callbackPath={`/b/${bubble.slug}`}
          overrideStyle={{ marginBottom: 10 }}
        />

        {error}
      </>
    )
  } else {
    return <div>Response verified!</div>
  }
}
