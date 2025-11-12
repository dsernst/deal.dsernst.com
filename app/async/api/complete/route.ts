import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

import { decryptAndValidatePayload } from '../decryptPayload'

// TODO: Replace with actual database
// For now, using in-memory Set (will be lost on restart)
const usedPayloadHashes = new Set<string>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bobValue, overlapOnly = false, payload } = body

    if (!payload || !bobValue)
      return NextResponse.json(
        { error: 'Missing required fields: payload, bobValue' },
        { status: 400 }
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
    const payloadHash = hashPayload(payload)
    if (usedPayloadHashes.has(payloadHash))
      return NextResponse.json(
        { error: 'This payload has already been used' },
        { status: 400 }
      )

    // Mark as used (atomic operation - in real DB this would be INSERT with unique constraint)
    usedPayloadHashes.add(payloadHash)

    // Determine which value is seller min and which is buyer max
    const sellerMin =
      aliceData.r === 's' ? Number(aliceData.v) : Number(bobValue)
    const buyerMax =
      aliceData.r === 'b' ? Number(aliceData.v) : Number(bobValue)

    // Run MPC calculation
    const mpcResult = calculateMPC(sellerMin, buyerMax, overlapOnly)

    // TODO: Send email to Alice with results
    // await sendEmail(aliceData.c, { sellerMin, buyerMax, ...mpcResult })

    // Return result to Bob
    return NextResponse.json({
      hasOverlap: mpcResult.hasOverlap,
      result: mpcResult.result,
    })
  } catch (error) {
    console.error('Error completing MPC:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculateMPC(
  sellerMin: number,
  buyerMax: number,
  overlapOnly: boolean
): { hasOverlap: boolean; result: null | number } {
  if (sellerMin > buyerMax) return { hasOverlap: false, result: null }

  if (overlapOnly) return { hasOverlap: true, result: null }

  // Pick a random point in the overlap (geometric mean approach)
  const spread = buyerMax - sellerMin
  const randomFactor = Math.random()
  const result = sellerMin + randomFactor * spread

  return { hasOverlap: true, result }
}

function hashPayload(payload: string): string {
  return crypto.createHash('sha256').update(payload).digest('hex')
}
