import { Tag } from '@ensdomains/thorin'

import { Gate } from '@/types'

export function GateTag({ gate }: { gate: Gate }) {
  return (
    <Tag colorStyle={gate === 'open' ? 'greenSecondary' : 'blueSecondary'}>
      {gate}
    </Tag>
  )
}
