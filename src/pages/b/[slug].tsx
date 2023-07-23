import {
  Button,
  Heading,
  Helper,
  Spinner,
  Typography,
  mq,
} from '@ensdomains/thorin'
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
import { useBubble } from '@/hooks/useBubble'
import { BubbleAccessResponseData } from '@/pages/api/bubbles/[id]/access'
import { Bubble } from '@/lib/db/interfaces/bubble'
import { getUserName } from '@/lib/client-db/services/user'
import { formatAddress } from '@/lib/utils'
import { User } from '@/lib/db/interfaces/user'
import { SismoConnect } from '@/components/SismoConnect'
import { Mute, Unmute } from '@/assets/icons'

export default function Bubble() {
  const router = useRouter()
  const { slug } = router.query
  const isMounted = useIsMounted()
  const { bubble, user: bubbleCreator } = useBubble(slug as string)

  return (
    <DailyProvider
      url={`https://ethglobal-hq.daily.co/${bubble?.slug}`}
      videoSource={false}
    >
      <Meta />

      <Layout $verticalCenter={false}>
        <Nav />

        <Container as="main">
          {isMounted && (
            <Content bubble={bubble} bubbleCreator={bubbleCreator} />
          )}
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
    flex-direction: column;
    gap: ${theme.space['4']};
    justify-content: space-between;

    ${mq.sm.min(css`
      flex-direction: row;
    `)}

    .buttons {
      display: flex;
      gap: ${theme.space['2']};
      justify-content: space-between;
      align-items: center;
    }
  `
)

const CardCols = styled.div<{ $active?: boolean }>(
  ({ $active, theme }) => css`
    ${$active &&
    css`
      display: grid;
      gap: ${theme.space['4']};

      ${mq.sm.min(css`
        grid-template-columns: 3fr 1.5fr;
      `)}
    `}
  `
)

const IconButton = styled(Button)`
  padding: 0rem;
  width: 7rem;

  & > div:first-child {
    transform: scale(1.4);
  }
`

function Content({
  bubble,
  bubbleCreator,
}: {
  bubble: Bubble | null
  bubbleCreator: User | null
}) {
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
        <HeadingWrapper style={{ marginBottom: '1rem' }}>
          <div>
            <Heading>{bubble.name}</Heading>
            <Typography>
              Creator: {getUserName(bubbleCreator || undefined)}
            </Typography>
          </div>
        </HeadingWrapper>

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
            {/* <Listeners people={[]} /> */}
          </div>

          {address && token ? (
            <>
              {bubble.privacyType === 'sismo' ? (
                <SismoConnect bubble={bubble} />
              ) : (
                <>
                  <Heading>Unauthorized</Heading>
                  <Helper>
                    You don&apos;t have access to this Bubble with your
                    connected address
                  </Helper>
                </>
              )}
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
      <HeadingWrapper style={{ marginBottom: '1rem' }}>
        <div>
          <Heading>{bubble.name}</Heading>
          <Typography>
            Creator: {getUserName(bubbleCreator || undefined)}
          </Typography>
        </div>

        <div className="buttons">
          {meetingState !== 'joined-meeting' ? null : isMuted ? (
            <IconButton
              size="small"
              shape="circle"
              // disabled={daily?.setLocalAudio}
              onClick={() => {
                daily?.setLocalAudio(true)
                setIsMuted(false)
              }}
            >
              <Mute />
            </IconButton>
          ) : (
            <IconButton
              size="small"
              shape="circle"
              onClick={() => {
                daily?.setLocalAudio(false)
                setIsMuted(true)
              }}
            >
              <Unmute />
            </IconButton>
          )}

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

      <CardCols $active={!!bubble.farcasterCastHash}>
        <Card $gap="medium">
          {participants.length > 0 ? (
            <ParticipantGrid>
              {participants.map((person) => (
                <Participant key={person.user_id} person={person} />
              ))}
            </ParticipantGrid>
          ) : (
            <Helper>There&apos;s nobody here yet :/</Helper>
          )}
        </Card>

        <Typography style={{ marginTop: '0.5rem' }}>
          {present} Listeners
        </Typography>

        {bubble.farcasterCastHash && (
          <FarcasterDiscussion hash={bubble.farcasterCastHash} />
        )}
      </CardCols>

      <DailyAudio />
    </>
  )
}

const Casts = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['4']};

    .cast {
      display: flex;
      flex-direction: column;
      gap: ${theme.space['1']};

      &__author {
        font-weight: 500;
      }

      &__text {
        padding: ${theme.space['2']};
        border-radius: ${theme.radii.medium};
        background-color: ${theme.colors.accentSurface};
      }
    }
  `
)

function FarcasterDiscussion({
  hash = '0xe51ceaedf3c9ba6a7009b3f933a30105b82958dd',
}: {
  hash: string
}) {
  const farcasterReplies = useFetch<SearchCasterResponse>(
    `https://searchcaster.xyz/api/search?merkleRoot=${hash}`
  )

  const reversedCasts = farcasterReplies.data?.casts.slice().reverse()

  return (
    <Card>
      <Typography fontVariant="headingFour" style={{ marginBottom: '0.5rem' }}>
        Discussion
      </Typography>

      <Casts>
        {reversedCasts?.map((cast) => {
          return (
            <div key={cast.merkleRoot} className="cast">
              <p className="cast__author">@{cast.body.username}</p>
              <p className="cast__text">{cast.body.data.text}</p>
            </div>
          )
        })}
      </Casts>
    </Card>
  )
}

type SearchCasterResponse = {
  casts: Array<{
    body: {
      publishedAt: number
      username: string
      data: {
        text: string
        image: any
        replyParentMerkleRoot?: string
        threadMerkleRoot: string
      }
    }
    meta: {
      displayName: string
      avatar: string
      isVerifiedAvatar: boolean
      numReplyChildren: number
      reactions: {
        count: number
        type: string
      }
      recasts: {
        count: number
      }
      watches: {
        count: number
      }
      replyParentUsername: {
        fid?: number
        username?: string
      }
      mentions?: Array<{
        fid: number
        pfp: {
          url: string
          verified: boolean
        }
        username: string
        displayName: string
      }>
    }
    merkleRoot: string
    uri: string
  }>
  meta: {
    count: number
    responseTime: number
  }
}
