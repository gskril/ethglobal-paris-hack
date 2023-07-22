import { Heading, Typography, mq } from '@ensdomains/thorin'
import { Toaster } from 'react-hot-toast'
import styled, { css } from 'styled-components'

import { Footer } from '@/components/Footer'
import { Meta } from '@/components/Meta'
import { Nav } from '@/components/Nav'
import { Container, Layout } from '@/components/atoms'
import { SiweButton } from '@/components/SiweButton'

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

export default function Home() {
  return (
    <>
      <Meta />

      <Layout>
        <Nav />

        <Container as="main">
          <Wrapper>
            <Title>Audio Chats for Ethereum</Title>
            <SiweButton />
          </Wrapper>
        </Container>

        <Footer />
      </Layout>

      <Toaster position="bottom-center" />
    </>
  )
}
