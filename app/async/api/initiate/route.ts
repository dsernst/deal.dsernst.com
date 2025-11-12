import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

if (!process.env.ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY must be set')
if (!process.env.SIGNING_KEY) throw new Error('SIGNING_KEY must be set')

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'base64')
const SIGNING_KEY = Buffer.from(process.env.SIGNING_KEY, 'base64')

// Uncomment to print new random keys to console
// console.log(`
//   ENCRYPTION_KEY=${crypto.randomBytes(32).toString('base64')},
//   SIGNING_KEY=${crypto.randomBytes(32).toString('base64')}
// `)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contact, role, value } = body

    if (!contact || !role || value === undefined)
      return NextResponse.json(
        { error: 'Missing required fields: contact, role, value' },
        { status: 400 }
      )

    if (role !== 'buyer' && role !== 'seller')
      return NextResponse.json(
        { error: 'Invalid role. Must be "buyer" or "seller"' },
        { status: 400 }
      )

    // Encrypt Alice's value
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv)

    let encrypted = cipher.update(value, 'utf8', 'base64')
    encrypted += cipher.final('base64')

    const authTag = cipher.getAuthTag()
    const encryptedValue = `${iv.toString('base64')}:${authTag.toString(
      'base64'
    )}:${encrypted}`

    // Create compact payload
    const timestamp = Date.now()
    const compactPayload = {
      ev: encryptedValue,
      r: role === 'buyer' ? 'b' : 's',
      t: timestamp,
    }

    const payloadString = JSON.stringify(compactPayload)
    const signature = crypto
      .createHmac('sha256', SIGNING_KEY)
      .update(payloadString)
      .digest('base64')

    // Return signed compact payload
    const signedPayload = {
      ...compactPayload,
      c: contact, // Include contact info in response (will be in Share URL)
      s: signature,
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
