import { createClient } from '@libsql/client'
import path from 'path'

// For local development, use a local SQLite file
// For production, use Turso URL and auth token from environment variables
const getDatabaseUrl = (): string => {
  if (process.env.TURSO_DATABASE_URL) return process.env.TURSO_DATABASE_URL

  // Local development: use a local SQLite file in the project root
  // Using absolute path to avoid issues with Next.js serverless functions
  return `file:${path.join(process.cwd(), 'local.db')}`
}

export function getDb() {
  const url = getDatabaseUrl()
  const authToken = process.env.TURSO_AUTH_TOKEN

  // For local file, no auth token needed
  if (url.startsWith('file:')) return createClient({ url })

  // For Turso remote, auth token is required
  if (!authToken)
    throw new Error('TURSO_AUTH_TOKEN is required for remote Turso database')

  return createClient({ authToken, url })
}

// Initialize database schema on first import
export async function initDb() {
  const db = getDb()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS payloads (
      payload_hash TEXT PRIMARY KEY,
      result TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `)
}
