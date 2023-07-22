import { Button, Heading, Helper, Spinner } from '@ensdomains/thorin'
import { useRouter } from 'next/router'
import { Toaster, toast } from 'react-hot-toast'
import {
  DailyProvider,
  useDaily,
  useParticipantCounts,
  useMeetingState,
  DailyAudio,
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
import { getUserName } from '@/lib/client-db/services/user'
import { formatAddress } from '@/lib/utils'
import { Address } from 'viem'

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
  const router = useRouter()
  const { address, token, user } = useGlobalContext()

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

  const daily = useDaily()
  const meetingState = useMeetingState()
  const { present } = useParticipantCounts()
  const _participants = daily?.participants()
  const participants = Object.values(_participants || {})

  console.log('Active listeners', present)

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
            <Button
              size="small"
              onClick={() =>
                daily?.join({
                  token: auth.data?.accessToken,
                  userName: getUserName(user) || formatAddress(address!),
                  userData: {
                    avatarUrl: user?.avatarUrl,
                    ensLabel: user?.ensLabel,
                    address: user?.address,
                    farcasterFName: user?.farcasterFName,
                    lensHandle: user?.lensHandle,
                  },
                })
              }
            >
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

          {meetingState === 'joined-meeting' && bubble?.userId === user?.id && (
            <Button
              size="small"
              colorStyle="redPrimary"
              onClick={async () => {
                const res = await fetch(`/api/bubbles/${bubble.id}`, {
                  method: 'DELETE',
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })

                if (res.ok) {
                  toast.success('Bubble ended for everyone')
                  router.push('/live')
                }
              }}
            >
              End for Everyone
            </Button>
          )}
        </div>
      </HeadingWrapper>

      <Card $gap="medium">
        <ParticipantGrid>
          {participants.map((person) => (
            <Participant key={person.user_id} person={person} />
          ))}
        </ParticipantGrid>
      </Card>

      <DailyAudio />
    </>
  )
}
