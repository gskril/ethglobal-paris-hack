export type Gate =
  | 'erc-1155'
  | 'erc-20'
  | 'erc-721'
  | 'farcaster'
  | 'open'
  | 'poap'
  | 'sismo'

export type User = {
  address: string
  name: string
  avatar: string
  farcaster: string
  lens: string
}

export type Bubble = {
  title: string
  slug: string
  gate: Gate
  people: User[]
}
