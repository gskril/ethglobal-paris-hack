import { UnauthorizedException } from 'next-api-decorators'

import { CryptoHelper } from '@/lib/crypto'
import { User } from '@/lib/db/interfaces/user'
import { getUserById } from '@/lib/db/services/user'

export const getUserAuthToken = (
  userId: string,
  expirationMs = 86400 * 1000 * 7 // 1 week duration
): string => {
  const cryptoHelper = new CryptoHelper(process.env.SECRET as string)
  const expirationDate = Date.now() + expirationMs // 8 days in ms
  const hash = cryptoHelper.encrypt(`${userId}:${expirationDate}`)
  return `${hash.iv.toString('hex')}:${hash.encrypted.toString('hex')}`
}

export async function verifyTokenAndGetUser(token: string): Promise<User> {
  const [encodedIv, encodedEncryptedPayload] = token.split(':')
  const decodedEncryptedPayload = Buffer.from(encodedEncryptedPayload, 'hex')
  const decodedIv = Buffer.from(encodedIv, 'hex')
  const cryptoHelper = new CryptoHelper(process.env.SECRET as string)
  const decrypted = cryptoHelper.decrypt(decodedEncryptedPayload, decodedIv)
  const [userId, expirationDate] = decrypted.toString('utf8').split(':')
  if (Date.now() > parseInt(expirationDate)) {
    throw new UnauthorizedException('Token expired')
  }
  const user = await getUserById(userId)
  if (!user) {
    throw new UnauthorizedException('Invalid token: user not found.')
  }
  return user
}
