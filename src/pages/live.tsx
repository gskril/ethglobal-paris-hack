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
