import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

export class CryptoHelper {
  private readonly secret: Buffer

  public constructor(secret: string) {
    if (!secret) {
      throw new Error('Encryptor initialization error: secret not found.')
    }
    this.secret = Buffer.from(secret, 'hex')
  }

  encrypt(payload: string): { encrypted: Buffer; iv: Buffer } {
    const iv = randomBytes(16)
    const cipher = createCipheriv('aes-256-cbc', this.secret, iv)

    let encrypted = cipher.update(payload)

    encrypted = Buffer.concat([encrypted, cipher.final()])

    return { iv, encrypted }
  }

  decrypt(encryptedPayload: Buffer, iv: Buffer): Buffer {
    const decipher = createDecipheriv('aes-256-cbc', this.secret, iv)

    let decrypted = decipher.update(encryptedPayload)

    decrypted = Buffer.concat([decrypted, decipher.final()])

    return decrypted
  }
}
