export interface SismoGroupsResponseType {
  groups: SismoGroup[]
}

export interface SismoGroupResponseType {
  group: SismoGroup
}

export interface SismoGroup {
  id: string
  generationFrequency: string
  description: string
  name: string
  specs: string
  latestSnapshot: {
    dataUrl: string
    timestamp: string
    id: string
    size: number
    valueDistribution: SismoGroupValueDistribution[]
  }
}

export interface SismoGroupValueDistribution {
  numberOfAccounts: number
  value: string
}
