import { Typography } from '@ensdomains/thorin'
import { Toaster } from 'react-hot-toast'

import { Footer } from '@/components/Footer'
import { Meta } from '@/components/Meta'
import { Nav } from '@/components/Nav'
import { Container, Layout } from '@/components/atoms'

export default function Create() {
  return (
    <>
      <Meta />

      <Layout>
        <Nav />

        <Container as="main">
          <Typography>Create a Bubble</Typography>
        </Container>

        <Footer />
      </Layout>

      <Toaster position="bottom-center" />
    </>
  )
}
