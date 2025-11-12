// Compact payload schema for shorter URLs
// Field names: ev=encryptedValue, r=role, t=timestamp, c=contact, s=signature
// Role values: b=buyer, s=seller
export type CompactPayload = {
  c: string // contact
  ev: string // encryptedValue
  r: 'b' | 's' // role: b=buyer, s=seller
  s: string // signature
  t: number // timestamp
}

type FullPayload = {
  contact: string
  encryptedValue: string
  role: 'buyer' | 'seller'
  signature: string
  timestamp: number
}

// Base64url encoding/decoding utilities
// Base64url is like base64 but URL-safe: uses - and _ instead of + and /, and no padding
export function decodePayload<T>(encoded: string): T {
  // In browser, convert from base64url to base64 and use atob
  if (typeof window !== 'undefined') {
    // Add padding back if needed
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    while (base64.length % 4) base64 += '='

    const json = decodeURIComponent(escape(atob(base64)))
    return JSON.parse(json) as T
  }

  // In Node.js, use Buffer
  return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as T
}

export function encodePayload(payload: unknown): string {
  const json = JSON.stringify(payload)
  // In browser, use btoa and convert to base64url
  if (typeof window !== 'undefined') {
    const base64 = btoa(unescape(encodeURIComponent(json)))
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }

  // In Node.js, use Buffer
  return Buffer.from(json, 'utf8').toString('base64url')
}

export function fromCompact(payload: CompactPayload): FullPayload {
  return {
    contact: payload.c,
    encryptedValue: payload.ev,
    role: payload.r === 'b' ? 'buyer' : 'seller',
    signature: payload.s,
    timestamp: payload.t,
  }
}

export function toCompact(payload: FullPayload): CompactPayload {
  return {
    c: payload.contact,
    ev: payload.encryptedValue,
    r: payload.role === 'buyer' ? 'b' : 's',
    s: payload.signature,
    t: payload.timestamp,
  }
}
