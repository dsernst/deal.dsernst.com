// Compact payload schema - just the encrypted value
// Everything (value, contact, timestamp, role) is encrypted together
// Format: iv.encryptedData (all base64url, . as separator)
export type CompactPayload = {
  ev: string // encryptedValue containing encrypted PlaintextData
}

export type PlaintextData = {
  c: string // contact email address
  r: 'b' | 's' // role: b=buyer, s=seller
  t: number // timestamp (minutes since epoch)
  v: string // value
}

const EPOCH_2025_MINUTES = Math.floor(
  new Date('2025-01-01T00:00:00Z').getTime() / (60 * 1000)
)

// Compact binary encoding for plaintext payload
// Format: [1 byte: role bit + contactLen (7 bits)] [contact] [3 bytes: timestamp] [varint: value]
// Role: bit 7 (0 = buyer, 1 = seller), contactLen: bits 0-6 (max 127 bytes)
// Timestamp: minutes since 2025-01-01 00:00:00 UTC (3 bytes = ~32 years)
// Value: varint-encoded number (1-4 bytes depending on size)
// All integers are big-endian
export function decodePlaintext(buffer: Buffer): PlaintextData {
  let offset = 0

  const firstByte = buffer[offset++]
  const role: 'b' | 's' = (firstByte & 0x80) === 0 ? 'b' : 's'
  const contactLen = firstByte & 0x7f
  const contact = buffer.subarray(offset, offset + contactLen).toString('utf8')
  offset += contactLen

  // Timestamp: 3 bytes, minutes since 2025-01-01
  const timestampMinutes = buffer.readUIntBE(offset, 3)
  const timestamp = EPOCH_2025_MINUTES + timestampMinutes
  offset += 3

  // Value: varint
  const valueOffset = { value: offset }
  const valueNum = decodeVarint(buffer, valueOffset)
  offset = valueOffset.value

  return { c: contact, r: role, t: timestamp, v: valueNum.toString() }
}

export function encodePlaintext(data: PlaintextData): Buffer {
  const roleBit = data.r === 's' ? 0x80 : 0
  const contactBytes = Buffer.from(data.c, 'utf8')
  const valueNum = parseInt(data.v, 10)

  if (contactBytes.length > 127)
    throw new Error('Contact too long (max 127 bytes)')

  if (isNaN(valueNum) || valueNum < 0)
    throw new Error('Value must be a non-negative number')

  // Timestamp: minutes since 2025-01-01
  const timestampMinutes = data.t - EPOCH_2025_MINUTES
  if (timestampMinutes < 0 || timestampMinutes > 0xffffff)
    throw new Error('Timestamp out of range')

  const valueVarint = encodeVarint(valueNum)

  const buffer = Buffer.allocUnsafe(
    1 + // role + contactLen
      contactBytes.length + // contact
      3 + // timestamp
      valueVarint.length // value (varint)
  )

  let offset = 0
  buffer[offset++] = roleBit | contactBytes.length
  contactBytes.copy(buffer, offset)
  offset += contactBytes.length
  buffer.writeUIntBE(timestampMinutes, offset, 3)
  offset += 3
  valueVarint.copy(buffer, offset)

  return buffer
}

function decodeVarint(buffer: Buffer, offset: { value: number }): number {
  let value = 0
  let shift = 0
  let byte: number

  do {
    byte = buffer[offset.value++]
    value |= (byte & 0x7f) << shift
    shift += 7
  } while (byte & 0x80)

  return value
}

function encodeVarint(value: number): Buffer {
  if (value < 0) throw new Error('Value must be non-negative')

  // 1 byte
  if (value < 128) return Buffer.from([value])

  // 2 bytes
  if (value < 16384) return Buffer.from([(value >> 8) | 0x80, value & 0xff])

  // 3 bytes
  if (value < 2097152)
    return Buffer.from([
      (value >> 16) | 0x80,
      ((value >> 8) & 0xff) | 0x80,
      value & 0xff,
    ])

  // 4 bytes
  return Buffer.from([
    (value >> 24) | 0x80,
    ((value >> 16) & 0xff) | 0x80,
    ((value >> 8) & 0xff) | 0x80,
    value & 0xff,
  ])
}
