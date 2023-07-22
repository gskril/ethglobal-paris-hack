import { Button, Heading, Input, Select } from '@ensdomains/thorin'
import { Toaster } from 'react-hot-toast'

import { Footer } from '@/components/Footer'
import { Meta } from '@/components/Meta'
import { Nav } from '@/components/Nav'
import { Card, Container, Layout } from '@/components/atoms'
import { useGlobalContext } from '@/hooks/useGlobalContext'
import { SiweButton } from '@/components/SiweButton'
import {
  CreateBubbleRequestData,
  CreateBubbleResponseData,
} from './api/bubbles'
import { useState } from 'react'
import { Gate } from '@/types'
import { BubblePrivacyType } from '@/lib/db/interfaces/bubble'
import { useIsMounted } from '@/hooks/useIsMounted'

export default function Create() {
  return (
    <>
      <Meta />

      <Layout>
        <Nav />

        <Container as="main">
          <Content />
        </Container>

        <Footer />
      </Layout>

      <Toaster position="bottom-center" />
    </>
  )
}

async function handleSubmit(
  e: React.FormEvent<HTMLFormElement>,
  token: string,
  body: CreateBubbleRequestData
) {
  e.preventDefault()

  const res = await fetch('/api/bubbles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    console.error(res)
    return
  }

  const bubble = (await res.json()) as CreateBubbleResponseData
}

function Content() {
  const { address, token } = useGlobalContext()
  const isMounted = useIsMounted()

  const [name, setName] = useState('')
  const [farcasterCastHash, setFarcasterCastHash] = useState('')
  const [erc20ContractAddress, setErc20ContractAddress] = useState('')
  const [erc721ContractAddress, setErc721ContractAddress] = useState('')
  const [erc1155ContractAddress, setErc1155ContractAddress] = useState('')
  const [erc1155TokenId, setErc1155TokenId] = useState<number | undefined>()
  const [erc20amount, setErc20amount] = useState<number | undefined>()
  const [privacyType, setPrivacyType] = useState<Gate>('erc721')
  const [sismoGroupId, setSismoGroupId] = useState('')
  const [poapEventId, setPoapEventId] = useState('')

  const body = {
    name,
    privacyType: privacyType as unknown as BubblePrivacyType,
    farcasterCastHash: farcasterCastHash || undefined,
    erc20ContractAddress: erc20ContractAddress || undefined,
    erc721ContractAddress: erc721ContractAddress || undefined,
    erc1155ContractAddress: erc1155ContractAddress || undefined,
    erc1155TokenId: erc1155TokenId || undefined,
    erc20amount: erc20amount || undefined,
    sismoGroupId: sismoGroupId || undefined,
    poapEventId: poapEventId || undefined,
  }

  if (!isMounted) return null

  return (
    <form onSubmit={(e) => handleSubmit(e, token!, body)}>
      <Heading style={{ marginBottom: '1rem' }}>Create a Bubble</Heading>

      <Card $gap="medium">
        <Input
          placeholder="My Bubble"
          label="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <Select
          placeholder="Open"
          label="Gating"
          options={[
            { label: 'Open', value: 'open' },
            { label: 'Farcaster', value: 'farcaster' },
            { label: 'ERC-721', value: 'erc721' },
            { label: 'ERC-1155', value: 'erc1155' },
            { label: 'POAP', value: 'poap' },
            { label: 'Sismo', value: 'sismo' },
          ]}
          onChange={(e) => setPrivacyType(e.target.value as Gate)}
        />

        {privacyType === 'erc721' && (
          <Input
            placeholder="0x253553366Da8546fC250F225fe3d25d0C782303b"
            label="ERC-721 Contract Address"
            onChange={(e) => setErc721ContractAddress(e.target.value)}
          />
        )}

        <Input
          placeholder="https://warpcast.com/greg/0x483e2a"
          label="Farcaster post to pull replies from"
          description="Warpcast URL or cast hash"
          onChange={(e) => setFarcasterCastHash(e.target.value)}
        />

        {address && token ? (
          <Button type="submit">Create and Go Live</Button>
        ) : (
          <SiweButton />
        )}
      </Card>
    </form>
  )
}
