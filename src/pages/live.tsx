import { Heading } from '@ensdomains/thorin'
import { Toaster } from 'react-hot-toast'

import { Bubble, BubbleGrid } from '@/components/Bubble'
import { Footer } from '@/components/Footer'
import { Meta } from '@/components/Meta'
import { Nav } from '@/components/Nav'
import { Container, Layout } from '@/components/atoms'
import { useBubbles } from '@/hooks/useBubbles'
import { useFetch } from 'usehooks-ts'
import { GetStatesResponseData } from './api/bubbles/stats'

export default function Live() {
  const bubbles = useBubbles()
  const stats = useFetch<GetStatesResponseData>('/api/bubbles/stats')

  return (
    <>
      <Meta />

      <Layout $verticalCenter={false}>
        <Nav />

        <Container as="main">
          <Heading style={{ marginBottom: '1rem' }}>Live Right Now</Heading>

          {bubbles && (
            <BubbleGrid>
              {bubbles.map((bubble) => {
                const listeners = getNumberOfListeners(bubble.slug, stats.data)

                return (
                  <Bubble
                    key={bubble.slug}
                    listenersCount={listeners}
                    {...bubble}
                  />
                )
              })}
            </BubbleGrid>
          )}
        </Container>

        <Footer />
      </Layout>

      <Toaster position="bottom-center" />
    </>
  )
}

function getNumberOfListeners(
  roomName: string,
  apiResponse: GetStatesResponseData | undefined
) {
  if (!apiResponse) {
    return undefined
  }

  const roomDataArray = apiResponse[roomName]
  if (roomDataArray) {
    return roomDataArray.length
  }
  return 0
}
