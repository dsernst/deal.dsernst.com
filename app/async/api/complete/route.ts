import { NextRequest, NextResponse } from 'next/server'

import { calcRandFairResult } from '../../calcRandFairResult'
import { decryptAndValidatePayload } from '../decryptPayload'
import { markPayloadAsUsed, storePayloadResult } from '../payloadDb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bobsValue, overlapOnly = false, payload } = body

    if (!payload || !bobsValue)
      return NextResponse.json(
        { error: 'Missing required fields: payload, bobsValue' },
        { status: 400 },
      )

    // Decrypt and validate Alice's payload
    const decryptResult = decryptAndValidatePayload(payload)
    if (decryptResult.error)
      return NextResponse.json({ error: decryptResult.error }, { status: 400 })

    // TypeScript now knows decryptResult.data is not null (discriminated union)
    if (!decryptResult.data)
      return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })

    const aliceData = decryptResult.data

    // Atomically check if payload has been used (hash-based)
    const { wasAlreadyUsed } = await markPayloadAsUsed(payload)
    if (wasAlreadyUsed)
      return NextResponse.json({ error: 'This payload has already been used' }, { status: 400 })

    // Determine which value is seller min and which is buyer max
    const sellerMin = aliceData.r === 's' ? Number(aliceData.v) : Number(bobsValue)
    const buyerMax = aliceData.r === 'b' ? Number(aliceData.v) : Number(bobsValue)

    // Run MPC calculation
    const mpcResult = calcRandFairResult(sellerMin, buyerMax, overlapOnly)

    // Store result in database so it can be retrieved later
    await storePayloadResult(payload, mpcResult)

    // Return result to Bob
    return NextResponse.json({
      hasOverlap: mpcResult.hasOverlap,
      result: mpcResult.result,
    })
  } catch (error) {
    console.error('Error completing MPC:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
