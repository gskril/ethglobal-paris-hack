import { Typography } from '@ensdomains/thorin'
import { Toaster } from 'react-hot-toast'

import { Footer } from '@/components/Footer'
import { Meta } from '@/components/Meta'
import { Nav } from '@/components/Nav'
import { Container, Layout } from '@/components/atoms'

export default function Live() {
  return (
    <>
      <Meta />

      <Layout>
        <Nav />

        <Container as="main">
          <Typography>All Bubbles</Typography>
        </Container>

        <Footer />
      </Layout>

      <Toaster position="bottom-center" />
    </>
  )
}
