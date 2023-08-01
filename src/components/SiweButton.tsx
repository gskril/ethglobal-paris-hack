import { useIsMounted } from '@/hooks/useIsMounted'
import { useAccount, useSignMessage } from 'wagmi'

import styled from 'styled-components'
import { Button, EthSVG } from '@ensdomains/thorin'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useGlobalContext } from '@/hooks/useGlobalContext'
import { useFetch } from 'usehooks-ts'
import { NonceResponseData } from '@/pages/api/auth/nonce'
import { SignInRequestData, SignInResponseData } from '@/pages/api/auth/sign-in'
import { useEffect } from 'react'
import { loginWithToken } from '@/lib/client-db/utils'

const StyledButton = styled(Button)`
  width: fit-content;
`

export function SiweButton() {
  const { address } = useAccount()
  const isMounted = useIsMounted()
  const { openConnectModal } = useConnectModal()
  const { token, setToken, firebaseToken, setFirebaseToken, user, setUser } =
    useGlobalContext()

  const messageToSign = useFetch<NonceResponseData>(
    !token ? '/api/auth/nonce' : undefined
  )

  const signature = useSignMessage({ message: messageToSign?.data?.message })

  const sendSignatureBody: Partial<SignInRequestData> = {
    address: address,
    signature: signature?.data,
    nonce: messageToSign?.data?.nonce,
  }

  const sendSignature = useFetch<SignInResponseData>(
    signature.data ? '/api/auth/sign-in' : undefined,
    {
      method: 'POST',
      body: JSON.stringify(sendSignatureBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  const responseIsLoading =
    signature.data && !sendSignature.data && !sendSignature.error

  useEffect(() => {
    const fetchCurrentUserData = async (firebaseToken: string) => {
      const user = await loginWithToken(firebaseToken!)
      setUser(user!)
    }
    if (sendSignature?.data?.token && sendSignature?.data?.firebaseToken) {
      fetchCurrentUserData(sendSignature?.data?.firebaseToken!)
      setToken(sendSignature?.data?.token)
      setFirebaseToken(sendSignature?.data?.firebaseToken)
    }
  }, [
    sendSignature?.data?.firebaseToken,
    sendSignature?.data?.token,
    setFirebaseToken,
    setToken,
    setUser,
  ])

  return (
    <>
      {!address || !isMounted ? (
        <StyledButton onClick={() => openConnectModal?.()}>
          Connect Wallet
        </StyledButton>
      ) : !token && !firebaseToken ? (
        <StyledButton
          prefix={<EthSVG />}
          loading={responseIsLoading || signature.isLoading}
          disabled={!isMounted || responseIsLoading || signature.isLoading}
          onClick={() => signature.signMessage?.()}
        >
          {signature.isLoading ? 'Sign in Wallet' : 'Sign-In with Ethereum'}
        </StyledButton>
      ) : (
        <Button
          as="a"
          href="/live"
          style={{
            width: 'fit-content',
          }}
        >
          Explore Live Bubbles
        </Button>
      )}
    </>
  )
}
