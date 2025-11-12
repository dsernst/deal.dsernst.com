import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

import { encodePlaintext } from '../../binaryEncoding'

if (!process.env.ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY must be set')

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'base64')

// Uncomment to print new encryption key to console
// console.log(`ENCRYPTION_KEY=${crypto.randomBytes(32).toString('base64')}`)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { role, value } = body

    if (!role || value === undefined)
      return NextResponse.json(
        { error: 'Missing required fields: role, value' },
        { status: 400 }
      )

    if (role !== 'buyer' && role !== 'seller')
      return NextResponse.json(
        { error: 'Invalid role. Must be "buyer" or "seller"' },
        { status: 400 }
      )

    // Encrypt everything together: value, timestamp, role
    const plaintextBuffer = encodePlaintext({
      r: role === 'buyer' ? 'b' : 's',
      t: Math.floor(Date.now() / (60 * 1000)),
      v: value,
    })

    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-ctr', ENCRYPTION_KEY, iv)

    const encryptedBuffer = Buffer.concat([
      cipher.update(plaintextBuffer),
      cipher.final(),
    ])
    // Use base64url (no padding) for more compact encoding
    // Format: iv.encryptedData (using . as separator, URL-safe)
    const encryptedValue = [iv, encryptedBuffer]
      .map((b) => b.toString('base64url'))
      .join('.')

    return NextResponse.json({ ev: encryptedValue })
  } catch (error) {
    console.error('Error initiating payload:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
