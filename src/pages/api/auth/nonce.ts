import { createHandler, Get } from 'next-api-decorators'
import crypto from 'crypto'
import { buildMessage } from '.'

export type NonceResponseData = {
  nonce: number
  message: string
}

class NonceHandler {
  @Get('/')
  public async nonce() {
    const nonce = crypto.randomInt(111111, 999999)
    return {
      nonce,
      message: buildMessage(nonce),
    }
  }
}

export default createHandler(NonceHandler)
