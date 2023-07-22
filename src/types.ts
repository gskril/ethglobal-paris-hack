export type Gate =
  | 'ERC-1155'
  | 'ERC-20'
  | 'ERC-721'
  | 'Farcaster'
  | 'Open'
  | 'POAP'
  | 'Sismo'

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
