export const buildMessage = (nonce: number) => {
  return `Hi there. Sign this message to prove you own this wallet. This is an offchain signature and doesn't cost anything.\n\nSecurity code (you can ignore this): ${nonce}`
}
