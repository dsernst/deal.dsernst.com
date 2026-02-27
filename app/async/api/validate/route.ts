import { NextRequest, NextResponse } from 'next/server'

import { decryptAndValidatePayload } from '../decryptPayload'
import { getPayloadRecord } from '../payloadDb'

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

    const data = result.data
    const base = { r: data.r, title: data.title, used: false }

    // Check if payload has already been used (if record exists, it's been used)
    const record = await getPayloadRecord(payload)
    if (record) {
      // If results exist, return them so the page can display them
      if (record.result) {
        return NextResponse.json({ ...base, result: record.result, used: true })
      }

      // Otherwise, just indicate it's been used
      return NextResponse.json({ error: 'This payload has already been used' }, { status: 400 })
    }

    return NextResponse.json(base)
  } catch (error) {
    console.error('Error validating payload:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
