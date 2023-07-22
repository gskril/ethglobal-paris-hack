import { Button, Heading, Helper, Spinner } from '@ensdomains/thorin'
import { useRouter } from 'next/router'
import { Toaster } from 'react-hot-toast'
import {
  DailyProvider,
  useDaily,
  useParticipantCounts,
  useRoom,
  useMeetingState,
  DailyAudio,
  useInputSettings,
} from '@daily-co/daily-react'
import { useFetch } from 'usehooks-ts'
import { useState } from 'react'
import styled, { css } from 'styled-components'

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
import { BubbleAccessResponseData } from '@/pages/api/bubbles/[id]/access'
import { Bubble } from '@/lib/db/interfaces/bubble'

export default function Bubble() {
  const router = useRouter()
  const { slug } = router.query
  const isMounted = useIsMounted()
  const bubble = useBubbleBySlug(slug as string)

  return (
    <DailyProvider
      url={`https://ethglobal-hq.daily.co/${bubble?.slug}`}
      videoSource={false}
    >
      <Meta />

      <Layout $verticalCenter={false}>
        <Nav />

        <Container as="main">
          {isMounted && <Content bubble={bubble} />}
        </Container>

        <Footer />
      </Layout>

      <Toaster position="bottom-center" />
    </DailyProvider>
  )
}

const HeadingWrapper = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    gap: ${theme.space['4']};
    justify-content: space-between;

    .buttons {
      display: flex;
      gap: ${theme.space['2']};
      justify-content: space-between;
      align-items: center;
    }
  `
)

function Content({ bubble }: { bubble: Bubble | null }) {
  const { address, token } = useGlobalContext()

  const auth = useFetch<BubbleAccessResponseData>(
    bubble ? `/api/bubbles/${bubble.id}/access` : undefined,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const [isMuted, setIsMuted] = useState(true)

  // const room = useRoom()
  const daily = useDaily()
  const meetingState = useMeetingState()
  const { present, hidden } = useParticipantCounts()

  console.log('Active users', present + hidden)

  if (!meetingState || !bubble || (!auth.data && !auth.error)) {
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
      <HeadingWrapper>
        <Heading style={{ marginBottom: '1rem' }}>{bubble.name}</Heading>

        <div className="buttons">
          {meetingState === 'joining-meeting' ? (
            <Spinner color="bluePrimary" size="medium" />
          ) : meetingState === 'joined-meeting' ? (
            <Button size="small" onClick={() => daily?.leave()}>
              Leave
            </Button>
          ) : (
            <Button size="small" onClick={() => daily?.join()}>
              Join
            </Button>
          )}

          {meetingState !== 'joined-meeting' ? null : isMuted ? (
            <Button
              size="small"
              // disabled={daily?.setLocalAudio}
              onClick={() => {
                daily?.setLocalAudio(true)
                setIsMuted(false)
              }}
            >
              Unmute
            </Button>
          ) : (
            <Button
              size="small"
              onClick={() => {
                daily?.setLocalAudio(false)
                setIsMuted(true)
              }}
            >
              Mute
            </Button>
          )}
        </div>
      </HeadingWrapper>

      <Card $gap="medium">
        <ParticipantGrid>
          {/* {bubble.people.map((person) => (
            <Participant key={person.name} person={person} />
          ))} */}
        </ParticipantGrid>
      </Card>

      <DailyAudio />
    </>
  )
}
