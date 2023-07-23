import Head from 'next/head'

interface Props {
  title?: string
  description?: string
  image?: string
}

export function Meta({
  title = 'Bubbles',
  description = 'Voice chats with your favorite onchain communities',
  image = 'https://thebubbles.xyz/sharing.jpg',
}: Props) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:image" content={image} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
    </Head>
  )
}
