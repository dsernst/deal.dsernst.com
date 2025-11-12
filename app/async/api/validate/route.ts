import { NextRequest, NextResponse } from 'next/server'

import { decryptAndValidatePayload } from '../decryptPayload'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { payload } = body

    const result = decryptAndValidatePayload(payload)
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    // TypeScript now knows result.data is not null (discriminated union)
    if (!result.data) {
      return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
    }

    // Return decrypted data (without sensitive info for client display)
    return NextResponse.json({
      r: result.data.r,
      // Don't send contact or value to client - they'll be used server-side only
    })
  } catch (error) {
    console.error('Error validating payload:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
