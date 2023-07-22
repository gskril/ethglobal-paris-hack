import { Heading } from '@ensdomains/thorin'
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

      <Layout $verticalCenter={false}>
        <Nav />

        <Container as="main">
          <Heading style={{ marginBottom: '1rem' }}>Live Right Now</Heading>

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
