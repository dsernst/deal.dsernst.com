// Compact payload schema - just the encrypted value
// Everything (value, contact, timestamp, role) is encrypted together
// Format: iv.authTag.encryptedData (all base64url, . as separator)
export type CompactPayload = {
  ev: string // encryptedValue containing: {c: contact, r: role, t: timestamp, v: value}
}

export type DecryptedPayload = {
  c: string // contact email address
  r: 'b' | 's' // role: b=buyer, s=seller
  t: number // timestamp (minutes since epoch)
  v: string // value
}
