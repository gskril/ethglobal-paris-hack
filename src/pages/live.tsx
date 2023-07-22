import { Heading } from '@ensdomains/thorin'
import { Toaster } from 'react-hot-toast'

import { Bubble, BubbleGrid } from '@/components/Bubble'
import { Footer } from '@/components/Footer'
import { Meta } from '@/components/Meta'
import { Nav } from '@/components/Nav'
import { Container, Layout } from '@/components/atoms'
import { useBubbles } from '@/hooks/useBubbles'
import { useGlobalContext } from '@/hooks/useGlobalContext'

export default function Live() {
  const { firebaseToken } = useGlobalContext()
  const bubbles = useBubbles()
  console.log(bubbles)

  return (
    <>
      <Meta />

      <Layout $verticalCenter={false}>
        <Nav />

        <Container as="main">
          <Heading style={{ marginBottom: '1rem' }}>Live Right Now</Heading>

          {bubbles && (
            <BubbleGrid>
              {bubbles.map((bubble) => (
                <Bubble key={bubble.slug} {...bubble} />
              ))}
            </BubbleGrid>
          )}
        </Container>

        <Footer />
      </Layout>

      <Toaster position="bottom-center" />
    </>
  )
}
