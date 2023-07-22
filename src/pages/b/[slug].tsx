import { Heading, Helper, Spinner, Typography } from '@ensdomains/thorin'
import { useRouter } from 'next/router'
import { Toaster } from 'react-hot-toast'
import styled, { css } from 'styled-components'

import { Footer } from '@/components/Footer'
import { GateTag } from '@/components/GateTag'
import { Meta } from '@/components/Meta'
import { Nav } from '@/components/Nav'
import { Card, Container, Layout } from '@/components/atoms'
import { Bubble } from '@/types'
import { Listeners } from '@/components/Bubble'
import { Participant, ParticipantGrid } from '@/components/Participant'

export default function Bubble() {
  return (
    <>
      <Meta />

      <Layout $verticalCenter={false}>
        <Nav />

        <Container as="main">
          <Content />
        </Container>

        <Footer />
      </Layout>

      <Toaster position="bottom-center" />
    </>
  )
}

function Content() {
  const router = useRouter()
  const { slug } = router.query
  const isLoading = false
  const isAuthed = true

  const bubble: Bubble = {
    title: 'Farcaster Dev Call',
    slug: 'test',
    gate: 'Farcaster',
    people: [
      {
        address: '',
        name: 'gregskril.eth',
        avatar:
          'https://pbs.twimg.com/profile_images/1134494299104731136/NQ0AB5DD_400x400.jpg',
        farcaster: '',
        lens: '',
      },
      {
        address: '',
        name: 'limone.eth',
        avatar:
          'https://pbs.twimg.com/profile_images/1609844701741420544/BsgkaetB_400x400.jpg',
        farcaster: '',
        lens: '',
      },
      {
        address: '',
        name: 'dwr.eth',
        avatar:
          'https://pbs.twimg.com/profile_images/1518670972559130624/-G9gNsOp_400x400.png',
        farcaster: '',
        lens: '',
      },
    ],
  }

  if (isLoading) {
    return <Spinner color="bluePrimary" size="medium" />
  }

  if (!isAuthed) {
    return (
      <>
        <Heading style={{ marginBottom: '1rem' }}>{bubble.title}</Heading>

        <Card
          style={{
            alignItems: 'center',
            paddingTop: '4rem',
            paddingBottom: '4rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <GateTag gate={bubble.gate} />
            <Listeners people={bubble.people} />
          </div>
          <Heading>Unauthorized</Heading>
          <Helper>
            You don&apos;t have access to this Bubble with your connected
            address
          </Helper>
        </Card>
      </>
    )
  }

  return (
    <>
      <Heading style={{ marginBottom: '1rem' }}>{bubble.title}</Heading>

      <Card>
        <ParticipantGrid>
          {bubble.people.map((person) => (
            <Participant key={person.name} person={person} />
          ))}
        </ParticipantGrid>
      </Card>
    </>
  )
}
