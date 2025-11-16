// Compact payload schema - just the encrypted value
// Everything (value, timestamp, role) is encrypted together
// Format: iv.encryptedData (all base64url, . as separator)
export type CompactPayload = {
  ev: string // encryptedValue containing encrypted PlaintextData
}

export type PlaintextData = {
  r: 'b' | 's' // role: b=buyer, s=seller
  t: number // timestamp (minutes since epoch)
  v: string // value
}

const EPOCH_2025_MINUTES = Math.floor(
  new Date('2025-01-01T00:00:00Z').getTime() / (60 * 1000)
)

// Compact binary encoding for plaintext payload
// Format: [1 byte: role] [3 bytes: timestamp] [varint: value]
// Role: 0 = buyer, 1 = seller
// Timestamp: minutes since 2025-01-01 00:00:00 UTC (3 bytes = ~32 years)
// Value: varint-encoded number (1-4 bytes depending on size)
// All integers are big-endian
export function decodePlaintext(buffer: Buffer): PlaintextData {
  // Minimum buffer size: 1 (role) + 3 (timestamp) + 1 (minimum varint) = 5 bytes
  if (buffer.length < 5) {
    throw new Error('Buffer too short: expected at least 5 bytes')
  }

  let offset = 0

  const roleByte = buffer[offset++]
  const role: 'b' | 's' = roleByte === 0 ? 'b' : 's'

  // Timestamp: 3 bytes, minutes since 2025-01-01
  if (offset + 3 > buffer.length) {
    throw new Error('Buffer too short: cannot read timestamp')
  }
  const timestampMinutes = buffer.readUIntBE(offset, 3)
  const timestamp = EPOCH_2025_MINUTES + timestampMinutes
  offset += 3

  // Value: varint
  const valueOffset = { value: offset }
  const valueNum = decodeVarint(buffer, valueOffset)
  offset = valueOffset.value

  return { r: role, t: timestamp, v: valueNum.toString() }
}

export function encodePlaintext(data: PlaintextData): Buffer {
  const roleByte = data.r === 's' ? 1 : 0
  const valueNum = parseInt(data.v, 10)

  if (isNaN(valueNum) || valueNum < 0)
    throw new Error('Value must be a non-negative number')

  // Timestamp: minutes since 2025-01-01
  const timestampMinutes = data.t - EPOCH_2025_MINUTES
  if (timestampMinutes < 0 || timestampMinutes > 0xffffff)
    throw new Error('Timestamp out of range')

  const valueVarint = encodeVarint(valueNum)

  const buffer = Buffer.allocUnsafe(
    1 + // role
      3 + // timestamp
      valueVarint.length // value (varint)
  )

  let offset = 0
  buffer[offset++] = roleByte
  buffer.writeUIntBE(timestampMinutes, offset, 3)
  offset += 3
  valueVarint.copy(buffer, offset)

  return buffer
}

function decodeVarint(buffer: Buffer, offset: { value: number }): number {
  let value = 0
  let shift = 0
  let byte: number
  const maxBytes = 4 // Maximum varint size (as per encodeVarint)
  const startOffset = offset.value

  do {
    // Check bounds before reading
    if (offset.value >= buffer.length) {
      throw new Error(
        `Buffer overflow: reading varint at offset ${startOffset}, buffer length ${buffer.length}`
      )
    }

    // Enforce maximum varint length (4 bytes)
    if (offset.value - startOffset >= maxBytes) {
      throw new Error(
        `Varint too long: maximum ${maxBytes} bytes, read ${
          offset.value - startOffset
        } bytes`
      )
    }

    byte = buffer[offset.value++]
    value |= (byte & 0x7f) << shift
    shift += 7
  } while (byte & 0x80)

  return value
}

function encodeVarint(value: number): Buffer {
  if (value < 0) throw new Error('Value must be non-negative')

  // Varint encoding: each byte contains 7 bits of data + 1 continuation bit
  // Low bits come first, high bits come last
  // Continuation bit (0x80) is set on all bytes except the last

  // 1 byte (0-127)
  if (value < 128) return Buffer.from([value])

  // 2 bytes (128-16383)
  if (value < 16384)
    return Buffer.from([
      (value & 0x7f) | 0x80, // low 7 bits with continuation
      (value >> 7) & 0x7f, // high 7 bits without continuation
    ])

  // 3 bytes (16384-2097151)
  if (value < 2097152)
    return Buffer.from([
      (value & 0x7f) | 0x80, // bits 0-6 with continuation
      ((value >> 7) & 0x7f) | 0x80, // bits 7-13 with continuation
      (value >> 14) & 0x7f, // bits 14-20 without continuation
    ])

  // 4 bytes (2097152+)
  return Buffer.from([
    (value & 0x7f) | 0x80, // bits 0-6 with continuation
    ((value >> 7) & 0x7f) | 0x80, // bits 7-13 with continuation
    ((value >> 14) & 0x7f) | 0x80, // bits 14-20 with continuation
    (value >> 21) & 0x7f, // bits 21-27 without continuation
  ])
}
