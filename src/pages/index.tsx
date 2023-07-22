import { Button, EthSVG, Heading, Typography, mq } from '@ensdomains/thorin'
import { Toaster } from 'react-hot-toast'
import styled, { css } from 'styled-components'
import { useAccount, useSignMessage } from 'wagmi'

import { Footer } from '@/components/Footer'
import { Meta } from '@/components/Meta'
import { Nav } from '@/components/Nav'
import { Container, Layout } from '@/components/atoms'
import { useFetch } from '@/hooks/useFetch'
import { useIsMounted } from '@/hooks/useIsMounted'

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

  return (
    <>
      <Meta />

      <Layout>
        <Nav />

        <Container as="main">
          <Wrapper>
            <Title>Audio Chats for Ethereum</Title>
            <StyledButton
              prefix={<EthSVG />}
              disabled={!address || !isMounted}
              onClick={() => signature.signMessage?.()}
            >
              Sign-In with Ethereum
            </StyledButton>
          </Wrapper>
        </Container>

        <Footer />
      </Layout>

      <Toaster position="bottom-center" />
    </>
  )
}
