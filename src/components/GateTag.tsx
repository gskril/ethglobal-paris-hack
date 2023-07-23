import { Tag } from '@ensdomains/thorin'

import { Gate } from '@/types'
import { Bubble } from '@/lib/db/interfaces/bubble'
import { formatAddress } from '@/lib/utils'

export function GateTag({
  gate,
  token,
  poapEvent,
  sismoGroup,
}: {
  gate: Gate
  token?: Bubble['token']
  poapEvent?: Bubble['poapEvent']
  sismoGroup?: Bubble['sismoGroup']
}) {
  return (
    <Tag colorStyle={gate === 'open' ? 'greenSecondary' : 'blueSecondary'}>
      {gate === 'erc20'
        ? `${token?.amount} ${token?.metadata?.token?.symbol}`
        : gate === 'poap'
        ? `"${poapEvent?.name}" POAP`
        : gate === 'farcaster'
        ? 'Farcaster'
        : gate === 'sismo'
        ? `Sismo: ${sismoGroup?.name}`
        : gate === 'erc721' || gate === 'erc1155'
        ? `${
            token?.metadata?.token?.collectionName ||
            token?.metadata?.token?.name ||
            formatAddress(token?.address || '')
          } NFT`
        : gate === 'open'
        ? 'Open'
        : gate}
    </Tag>
  )
}
