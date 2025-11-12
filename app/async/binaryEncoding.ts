// Compact payload schema - just the encrypted value
// Everything (value, contact, timestamp, role) is encrypted together
// Format: iv.authTag.encryptedData (all base64url, . as separator)
export type CompactPayload = {
  ev: string // encryptedValue containing encrypted PlaintextData
}

export type PlaintextData = {
  c: string // contact email address
  r: 'b' | 's' // role: b=buyer, s=seller
  t: number // timestamp (minutes since epoch)
  v: string // value
}

// Compact binary encoding for plaintext payload
// Format: [1 byte: role] [1 byte: contactLen] [contact] [4 bytes: timestamp] [1 byte: valueLen] [value]
// Role: 0 = buyer, 1 = seller
// All integers are big-endian
export function decodePlaintext(buffer: Buffer): PlaintextData {
  let offset = 0

  const role = buffer[offset++] === 0 ? 'b' : 's'
  const contactLen = buffer[offset++]
  const contact = buffer.subarray(offset, offset + contactLen).toString('utf8')
  offset += contactLen
  const timestamp = buffer.readUInt32BE(offset)
  offset += 4
  const valueLen = buffer[offset++]
  const value = buffer.subarray(offset, offset + valueLen).toString('utf8')

  return { c: contact, r: role, t: timestamp, v: value }
}

export function encodePlaintext(data: PlaintextData): Buffer {
  const role = data.r === 'b' ? 0 : 1
  const contactBytes = Buffer.from(data.c, 'utf8')
  const valueBytes = Buffer.from(data.v, 'utf8')

  if (contactBytes.length > 255 || valueBytes.length > 255) {
    throw new Error('Contact or value too long for binary encoding')
  }

  const buffer = Buffer.allocUnsafe(
    1 + // role
      1 + // contact length
      contactBytes.length + // contact
      4 + // timestamp (32-bit int)
      1 + // value length
      valueBytes.length // value
  )

  let offset = 0
  buffer[offset++] = role
  buffer[offset++] = contactBytes.length
  contactBytes.copy(buffer, offset)
  offset += contactBytes.length
  buffer.writeUInt32BE(data.t, offset)
  offset += 4
  buffer[offset++] = valueBytes.length
  valueBytes.copy(buffer, offset)

  return buffer
}
