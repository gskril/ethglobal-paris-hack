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

const StyledButton = styled(Button)`
  width: fit-content;
`

export function SiweButton() {
  const { address } = useAccount()
  const isMounted = useIsMounted()
  const { openConnectModal } = useConnectModal()
  const { token, setToken, firebaseToken, setFirebaseToken } =
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

  useEffect(() => {
    if (sendSignature?.data?.token && sendSignature?.data?.firebaseToken) {
      setToken(sendSignature?.data?.token)
      setFirebaseToken(sendSignature?.data?.firebaseToken)
    }
  }, [
    sendSignature?.data?.firebaseToken,
    sendSignature?.data?.token,
    setFirebaseToken,
    setToken,
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
          disabled={!isMounted}
          onClick={() => signature.signMessage?.()}
        >
          Sign-In with Ethereum
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
