import { Heading, Helper, Spinner, Typography } from '@ensdomains/thorin'
import { useRouter } from 'next/router'
import { Toaster } from 'react-hot-toast'

import { Footer } from '@/components/Footer'
import { GateTag } from '@/components/GateTag'
import { Meta } from '@/components/Meta'
import { Nav } from '@/components/Nav'
import { Card, Container, Layout } from '@/components/atoms'
import { Listeners } from '@/components/Bubble'
import { Participant, ParticipantGrid } from '@/components/Participant'
import { useGlobalContext } from '@/hooks/useGlobalContext'
import { SiweButton } from '@/components/SiweButton'
import { useIsMounted } from '@/hooks/useIsMounted'
import { useBubbleBySlug } from '@/hooks/useBubble'
import { useFetch } from 'usehooks-ts'
import { BubbleAccessResponseData } from '../api/bubbles/[id]/access'

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

  const bubble = useBubbleBySlug(slug as string)
  const auth = useFetch<BubbleAccessResponseData>(
    bubble ? `/api/bubbles/${bubble.id}/access` : undefined,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!isMounted || !bubble || (!auth.data && !auth.error)) {
    return <Spinner color="bluePrimary" size="medium" />
  }

  if (auth.error) {
    return (
      <>
        <Heading style={{ marginBottom: '1rem' }}>{bubble.name}</Heading>

        <Card
          $gap="medium"
          style={{
            alignItems: 'center',
            paddingTop: '4rem',
            paddingBottom: '4rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <GateTag gate={bubble.privacyType} />
            <Listeners people={[]} />
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
      <Heading style={{ marginBottom: '1rem' }}>{bubble.name}</Heading>

      <Card $gap="medium">
        <ParticipantGrid>
          {/* {bubble.people.map((person) => (
            <Participant key={person.name} person={person} />
          ))} */}
        </ParticipantGrid>
      </Card>
    </>
  )
}
