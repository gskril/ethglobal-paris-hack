import { Button, EthSVG, Heading, Typography, mq } from '@ensdomains/thorin'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import styled, { css } from 'styled-components'
import { useFetch, useLocalStorage } from 'usehooks-ts'
import { useAccount, useSignMessage } from 'wagmi'

import { Footer } from '@/components/Footer'
import { Meta } from '@/components/Meta'
import { Nav } from '@/components/Nav'
import { Container, Layout } from '@/components/atoms'
import { useIsMounted } from '@/hooks/useIsMounted'
import { useGlobalContext } from '@/hooks/useGlobalContext'

import { NonceResponseData } from './api/auth/nonce'
import { SignInRequestData, SignInResponseData } from './api/auth/sign-in'

const Wrapper = styled.div(
  ({ theme }) => css`
    gap: ${theme.space['4']};
    display: flex;
    text-align: center;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  `
)

const Title = styled(Heading)`
  font-size: 2rem;
  font-weight: 850;

  ${mq.sm.min(css`
    font-size: 2.5rem;
  `)}
`

const Description = styled(Typography)(
  ({ theme }) => css`
    line-height: 1.4;
    color: ${theme.colors.grey};
    font-size: ${theme.fontSizes.large};
  `
)

const StyledButton = styled(Button)`
  width: fit-content;
`

export default function Home() {
  const { address } = useAccount()
  const isMounted = useIsMounted()
  const { openConnectModal } = useConnectModal()
  const messageToSign = useFetch<NonceResponseData>('/api/auth/nonce')

  const signature = useSignMessage({
    message: messageToSign?.data?.message,
  })

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

  const { token: storedToken, setToken: setStoredToken } = useGlobalContext()

  useEffect(() => {
    if (sendSignature?.data?.token) {
      setStoredToken(sendSignature?.data?.token)
    }
  }, [sendSignature?.data?.token, setStoredToken])

  return (
    <>
      <Meta />

      <Layout>
        <Nav />

        <Container as="main">
          <Wrapper>
            <Title>Audio Chats for Ethereum</Title>
            {!address || !isMounted ? (
              <StyledButton onClick={() => openConnectModal?.()}>
                Connect Wallet
              </StyledButton>
            ) : !storedToken ? (
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
          </Wrapper>
        </Container>

        <Footer />
      </Layout>

      <Toaster position="bottom-center" />
    </>
  )
}
