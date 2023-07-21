import { Heading } from '@ensdomains/thorin'

import { Footer } from '@/components/Footer'
import { Meta } from '@/components/Meta'
import { Nav } from '@/components/Nav'
import { Container, Layout } from '@/components/atoms'

export default function Home() {
  return (
    <>
      <Meta />

      <Layout>
        <Nav />

        <Container as="main">
          <Heading>Bubbles</Heading>
        </Container>

        <Footer />
      </Layout>
    </>
  )
}
