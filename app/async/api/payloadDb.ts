import crypto from 'crypto'

import { getDb, initDb } from './db'

type MPCResult = {
  hasOverlap: boolean
  result: null | number
}

type PayloadRecord = {
  result: MPCResult | null
}

// Initialize database on module load
let dbInitialized = false
const initPromise = initDb().then(() => (dbInitialized = true))

export async function getPayloadRecord(
  payload: string
): Promise<null | PayloadRecord> {
  if (!dbInitialized) await initPromise

  const hash = hashPayload(payload)
  const db = getDb()

  const result = await db.execute({
    args: [hash],
    sql: 'SELECT result FROM payloads WHERE payload_hash = ?',
  })

  if (result.rows.length === 0) return null

  const row = result.rows[0]
  const resultJson = row.result as null | string

  return { result: resultJson ? JSON.parse(resultJson) : null }
}

export function hashPayload(payload: string): string {
  return crypto.createHash('sha256').update(payload).digest('hex')
}

export async function markPayloadAsUsed(
  payload: string
): Promise<{ wasAlreadyUsed: boolean }> {
  if (!dbInitialized) await initPromise

  const hash = hashPayload(payload)
  const db = getDb()

  // Try to atomically insert the record
  // If it already exists (PRIMARY KEY constraint), INSERT OR IGNORE will silently skip it
  const insertResult = await db.execute({
    args: [hash],
    sql: 'INSERT OR IGNORE INTO payloads (payload_hash) VALUES (?)',
  })

  // If rowsAffected = 0, the record already existed (was already used)
  // If rowsAffected > 0, we successfully inserted (was not already used)
  return { wasAlreadyUsed: insertResult.rowsAffected === 0 }
}

export async function storePayloadResult(
  payload: string,
  result: MPCResult
): Promise<void> {
  if (!dbInitialized) await initPromise

  const hash = hashPayload(payload)
  const db = getDb()
  const resultJson = JSON.stringify(result)

  // Use INSERT OR REPLACE to handle both new and existing records
  await db.execute({
    args: [hash, resultJson, resultJson],
    sql: 'INSERT INTO payloads (payload_hash, result) VALUES (?, ?) ON CONFLICT(payload_hash) DO UPDATE SET result = ?',
  })
}
