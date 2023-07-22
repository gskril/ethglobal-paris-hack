export type Gate =
  | 'erc721'
  | 'erc1155'
  | 'erc20'
  | 'sismo'
  | 'farcaster'
  | 'lens'
  | 'poap'
  | 'open'

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
