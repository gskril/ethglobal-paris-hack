import { createHandler, Get } from 'next-api-decorators'
import crypto from 'crypto'
import { SismoHelper } from '@/lib/sismo'

export type NonceResponseData = {
  nonce: number
  message: string
}

class NonceHandler {
  @Get('/')
  public async nonce() {
    const nonce = crypto.randomInt(111111, 999999)
    console.log(
      await new SismoHelper().getGroup('0x682544d549b8a461d7fe3e589846bb7b')
    )
    return {
      nonce,
      message: `Hi there. Sign this message to prove you own this wallet. This doesn't cost anything.\n\nSecurity code (you can ignore this): ${nonce}`,
    }
  }
}

export default createHandler(NonceHandler)
