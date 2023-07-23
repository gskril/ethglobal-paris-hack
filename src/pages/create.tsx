import { Button, Heading, Helper, Input, Select } from '@ensdomains/thorin'
import { Toaster, toast } from 'react-hot-toast'

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
import { NextRouter, useRouter } from 'next/router'

export default function Create() {
  return (
    <>
      <Meta title="Create a Voice Chat" />

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
  router: NextRouter,
  token: string,
  body: CreateBubbleRequestData,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string) => void
) {
  e.preventDefault()
  setIsLoading(true)

  let farcasterHash = body.farcasterCastHash

  if (farcasterHash && farcasterHash.includes('warpcast.com')) {
    try {
      const res = await fetch(
        `https://fardrop.xyz/api/warpcast-to-hash?url=${farcasterHash}`
      )
      const json = await res.json()
      farcasterHash = json.hash
    } catch (err) {
      farcasterHash = undefined
    }
  }

  body.farcasterCastHash = farcasterHash

  const res = await fetch('/api/bubbles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  const json = await res.json()

  if (!res.ok) {
    console.error(res)
    toast.error('Something went wrong')
    setError(json.message)
    setIsLoading(false)
    return
  }

  setIsLoading(false)
  const bubble = json as CreateBubbleResponseData
  toast.success('Bubble created')
  router.push(`/b/${bubble.slug}`)
}

function Content() {
  const { address, token } = useGlobalContext()
  const isMounted = useIsMounted()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [farcasterCastHash, setFarcasterCastHash] = useState('')
  const [erc20ContractAddress, setErc20ContractAddress] = useState('')
  const [erc721ContractAddress, setErc721ContractAddress] = useState('')
  const [erc1155ContractAddress, setErc1155ContractAddress] = useState('')
  const [erc1155TokenId, setErc1155TokenId] = useState('')
  const [erc20amount, setErc20amount] = useState<number | undefined>()
  const [privacyType, setPrivacyType] = useState<Gate>('open')
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
    <form
      onSubmit={(e) =>
        handleSubmit(e, router, token!, body, setIsLoading, setError)
      }
    >
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
            { label: 'ERC-20', value: 'erc20' },
            { label: 'POAP', value: 'poap' },
            { label: 'Sismo', value: 'sismo' },
          ]}
          onChange={(e) => setPrivacyType(e.target.value as Gate)}
        />

        {privacyType === 'erc721' && (
          <Input
            placeholder="0x253553366Da8546fC250F225fe3d25d0C782303b"
            label="ERC-721 Contract Address"
            description="Ethereum mainnet only"
            onChange={(e) => setErc721ContractAddress(e.target.value)}
          />
        )}

        {privacyType === 'erc1155' && (
          <>
            <Input
              placeholder="0x253553366Da8546fC250F225fe3d25d0C782303b"
              label="ERC-1155 Contract Address"
              description="Ethereum mainnet only"
              onChange={(e) => setErc1155ContractAddress(e.target.value)}
            />

            <Input
              placeholder="1"
              label="Token ID"
              onChange={(e) => setErc1155TokenId(e.target.value)}
            />
          </>
        )}

        {privacyType === 'erc20' && (
          <>
            <Input
              placeholder="0x253553366Da8546fC250F225fe3d25d0C782303b"
              label="ERC-20 Contract Address"
              description="Ethereum mainnet only"
              onChange={(e) => setErc20ContractAddress(e.target.value)}
            />

            <Input
              placeholder="200"
              label="Amount"
              onChange={(e) => setErc20amount(parseInt(e.target.value))}
            />
          </>
        )}

        {privacyType === 'poap' && (
          <Input
            placeholder="128480"
            label="POAP Event ID"
            onChange={(e) => setPoapEventId(e.target.value)}
          />
        )}

        {privacyType === 'sismo' && (
          <Input
            placeholder="0x7e47b71e43f993280bad03a937399333"
            label="Sismo Group ID"
            description={
              <a
                href="https://factory.sismo.io/groups-explorer"
                target="_blank"
              >
                See your options ↗
              </a>
            }
            onChange={(e) => setSismoGroupId(e.target.value)}
          />
        )}

        <Input
          placeholder="https://warpcast.com/greg/0x483e2a"
          label="Farcaster post to pull replies from"
          description="Warpcast URL or cast hash"
          onChange={(e) => setFarcasterCastHash(e.target.value)}
        />

        {address && token ? (
          <Button type="submit" disabled={isLoading} loading={isLoading}>
            Create and Go Live
          </Button>
        ) : (
          <SiweButton />
        )}

        {error && <Helper type="error">{error}</Helper>}
      </Card>
    </form>
  )
}
