import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

if (!process.env.ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY must be set')

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'base64')

// Uncomment to print new encryption key to console
// console.log(`ENCRYPTION_KEY=${crypto.randomBytes(32).toString('base64')}`)

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

    // Encrypt everything together: value, contact, timestamp, role
    // This keeps contact info private and GCM auth tag provides authentication
    const plaintext = JSON.stringify({
      c: contact,
      r: role === 'buyer' ? 'b' : 's',
      t: Math.floor(Date.now() / (60 * 1000)),
      v: value,
    })

    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv)

    const encryptedBuffer = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ])
    const authTag = cipher.getAuthTag().slice(0, 12) // Truncate to 12 bytes (96 bits), still secure for short-lived payloads
    // Use base64url (no padding) for more compact encoding
    // Format: iv.authTag.encryptedData (using . as separator, URL-safe)
    const encryptedValue = `${iv.toString('base64url')}.${authTag.toString(
      'base64url'
    )}.${encryptedBuffer.toString('base64url')}`

    return NextResponse.json({ ev: encryptedValue })
  } catch (error) {
    console.error('Error initiating payload:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
