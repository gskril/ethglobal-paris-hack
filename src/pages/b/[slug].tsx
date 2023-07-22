import { Typography } from '@ensdomains/thorin'
import { useRouter } from 'next/router'
import { Toaster } from 'react-hot-toast'

import { Footer } from '@/components/Footer'
import { Meta } from '@/components/Meta'
import { Nav } from '@/components/Nav'
import { Container, Layout } from '@/components/atoms'

export default function Bubble() {
  const router = useRouter()
  const { slug } = router.query

  return (
    <>
      <Meta />

      <Layout>
        <Nav />

        <Container as="main">
          <Typography>Bubble: {slug}</Typography>
        </Container>

        <Footer />
      </Layout>

      <Toaster position="bottom-center" />
    </>
  )
}
