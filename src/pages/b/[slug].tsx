import { Heading, Helper, Spinner, Typography } from '@ensdomains/thorin'
import { useRouter } from 'next/router'
import { Toaster } from 'react-hot-toast'

import { Footer } from '@/components/Footer'
import { GateTag } from '@/components/GateTag'
import { Meta } from '@/components/Meta'
import { Nav } from '@/components/Nav'
import { Card, Container, Layout } from '@/components/atoms'
import { Bubble } from '@/types'
import { Listeners } from '@/components/Bubble'
import { Participant, ParticipantGrid } from '@/components/Participant'
import { useGlobalContext } from '@/hooks/useGlobalContext'
import { SiweButton } from '@/components/SiweButton'
import { useIsMounted } from '@/hooks/useIsMounted'

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
  const { address, token } = useGlobalContext()
  const isMounted = useIsMounted()

  const isLoading = false
  const isAuthed = false

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

  if (isLoading || !isMounted) {
    return <Spinner color="bluePrimary" size="medium" />
  }

  if (!isAuthed) {
    return (
      <>
        <Heading style={{ marginBottom: '1rem' }}>{bubble.title}</Heading>

        <Card
          $gap="medium"
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

          {address && token ? (
            <>
              <Heading>Unauthorized</Heading>
              <Helper>
                You don&apos;t have access to this Bubble with your connected
                address
              </Helper>
            </>
          ) : (
            <SiweButton />
          )}
        </Card>
      </>
    )
  }

  return (
    <>
      <Heading style={{ marginBottom: '1rem' }}>{bubble.title}</Heading>

      <Card $gap="medium">
        <ParticipantGrid>
          {bubble.people.map((person) => (
            <Participant key={person.name} person={person} />
          ))}
        </ParticipantGrid>
      </Card>
    </>
  )
}
