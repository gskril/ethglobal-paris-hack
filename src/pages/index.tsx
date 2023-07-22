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
    max-width: ${theme.space['128']};
    margin-left: auto;
    margin-right: auto;
  `
)

const Title = styled(Heading)`
  font-size: 2rem;
  font-weight: 850;

  ${mq.sm.min(css`
    font-size: 2rem;
  `)}
`

export default function Home() {
  return (
    <>
      <Meta />

      <Layout>
        <Nav />

        <Container as="main">
          <Wrapper>
            <Title>
              Voice chats with your favorite{' '}
              <s style={{ color: 'rgb(197, 47, 27)' }}>on-chain</s>{' '}
              <span style={{ color: 'rgb(29, 175, 131)' }}>onchain</span>{' '}
              communities
            </Title>
            <SiweButton />
          </Wrapper>
        </Container>

        <Footer />
      </Layout>

      <Toaster position="bottom-center" />
    </>
  )
}
