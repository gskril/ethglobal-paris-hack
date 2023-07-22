import { Toaster } from 'react-hot-toast'

import { Bubble, BubbleGrid } from '@/components/Bubble'
import { Footer } from '@/components/Footer'
import { Meta } from '@/components/Meta'
import { Nav } from '@/components/Nav'
import { Container, Layout } from '@/components/atoms'
import { Bubble as BubbleType } from '@/types'

export default function Live() {
  const bubbles: BubbleType[] = [
    {
      title: 'Farcaster Dev Call',
      slug: 'test',
      gate: 'farcaster',
      people: [],
    },
  ]

  return (
    <>
      <Meta />

      <Layout>
        <Nav />

        <Container as="main">
          <BubbleGrid>
            {bubbles.map((bubble) => (
              <Bubble key={bubble.slug} {...bubble} />
            ))}
          </BubbleGrid>
        </Container>

        <Footer />
      </Layout>

      <Toaster position="bottom-center" />
    </>
  )
}
