export const cleanObject = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) =>
    obj[key] === undefined ? delete obj[key] : {}
  )
  return obj
}

export function formatAddress(address: string, shortened = false): string {
  if (shortened) {
    return address.slice(0, 5)
  }
  return `${address.slice(0, 4)}…${address.slice(-4)}`
}
