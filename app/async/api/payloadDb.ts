import crypto from 'crypto'

// TODO: Replace with actual database
// For now, using in-memory Map (will be lost on restart)
type MPCResult = {
  hasOverlap: boolean
  result: null | number
}

type PayloadRecord = {
  result: MPCResult | null
  used: boolean
}

const payloadDb = new Map<string, PayloadRecord>()

export function getPayloadRecord(payload: string): null | PayloadRecord {
  const hash = hashPayload(payload)
  return payloadDb.get(hash) || null
}

export function hashPayload(payload: string): string {
  return crypto.createHash('sha256').update(payload).digest('hex')
}

export function markPayloadAsUsed(payload: string): boolean {
  const hash = hashPayload(payload)
  const existing = payloadDb.get(hash)
  if (existing?.used) return false // Already used

  // Mark as used (atomic operation - in real DB this would be INSERT with unique constraint)
  payloadDb.set(hash, { result: existing?.result || null, used: true })
  return true
}

export function storePayloadResult(payload: string, result: MPCResult): void {
  const hash = hashPayload(payload)
  const existing = payloadDb.get(hash)
  payloadDb.set(hash, {
    result,
    used: existing?.used || false,
  })
}
