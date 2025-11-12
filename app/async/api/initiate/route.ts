import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

// TODO: Store encryption key securely (environment variable)
// For now, using a placeholder - in production, this should be from env vars
// If from env var, it should be base64 encoded
function getKey(envKey: string | undefined, defaultKey: Buffer): Buffer {
  if (envKey) return Buffer.from(envKey, 'base64')

  return defaultKey
}

const ENCRYPTION_KEY = getKey(
  process.env.ENCRYPTION_KEY,
  crypto.randomBytes(32)
)
const SIGNING_KEY = getKey(process.env.SIGNING_KEY, crypto.randomBytes(32))

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contact, role, value } = body

    if (!contact || !role || value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: contact, role, value' },
        { status: 400 }
      )
    }

    if (role !== 'buyer' && role !== 'seller') {
      return NextResponse.json(
        { error: 'Invalid role. Must be "buyer" or "seller"' },
        { status: 400 }
      )
    }

    // Encrypt Alice's value
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv)

    let encrypted = cipher.update(value, 'utf8', 'base64')
    encrypted += cipher.final('base64')

    const authTag = cipher.getAuthTag()
    const encryptedValue = `${iv.toString('base64')}:${authTag.toString(
      'base64'
    )}:${encrypted}`

    // Create payload
    const timestamp = Date.now()
    const payload = {
      encryptedValue,
      role,
      timestamp,
    }

    const payloadString = JSON.stringify(payload)
    const signature = crypto
      .createHmac('sha256', SIGNING_KEY)
      .update(payloadString)
      .digest('base64')

    // Return signed payload
    const signedPayload = {
      ...payload,
      contact, // Include contact info in response (will be in Share URL)
      signature,
    }

    return NextResponse.json(signedPayload)
  } catch (error) {
    console.error('Error initiating payload:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
