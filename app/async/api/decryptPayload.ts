import crypto from 'crypto'

import { decodePlaintext, type PlaintextData } from '../binaryEncoding'

if (!process.env.ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY must be set')

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'base64')

// 24 hours in minutes
const EXPIRATION_MINUTES = 24 * 60

type DecryptResult =
  | { data: null; error: string }
  | { data: PlaintextData; error: null }

export function decryptAndValidatePayload(payload: string): DecryptResult {
  try {
    if (!payload || typeof payload !== 'string')
      return { data: null, error: 'Missing or invalid payload' }

    // Parse payload: iv.encryptedData
    const parts = payload.split('.')
    if (parts.length !== 2)
      return { data: null, error: 'Invalid payload format' }

    const [ivBase64, encryptedDataBase64] = parts
    const iv = Buffer.from(ivBase64, 'base64url')
    const encryptedData = Buffer.from(encryptedDataBase64, 'base64url')

    // Decrypt
    const decipher = crypto.createDecipheriv('aes-256-ctr', ENCRYPTION_KEY, iv)
    const plaintextBuffer = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ])

    // Decode binary format
    const decrypted = decodePlaintext(plaintextBuffer)

    // Validate timestamp (24 hour expiration)
    const nowMinutes = Math.floor(Date.now() / (60 * 1000))
    const ageMinutes = nowMinutes - decrypted.t
    if (ageMinutes > EXPIRATION_MINUTES)
      return { data: null, error: 'Payload has expired (24 hour limit)' }

    if (ageMinutes < 0)
      return { data: null, error: 'Invalid timestamp (future date)' }

    return { data: decrypted, error: null }
  } catch (error) {
    console.error('Error decrypting payload:', error)
    return { data: null, error: 'Invalid or corrupted payload' }
  }
}
