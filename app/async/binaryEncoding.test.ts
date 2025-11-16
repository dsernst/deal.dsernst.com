import { describe, expect, test } from 'bun:test'

import {
  decodePlaintext,
  encodePlaintext,
  type PlaintextData,
} from './binaryEncoding'

const EPOCH_2025_MINUTES = Math.floor(
  new Date('2025-01-01T00:00:00Z').getTime() / (60 * 1000)
)

describe('binaryEncoding', () => {
  describe('decode(encode(x)) = x', () => {
    test('small value (1-byte varint)', () => {
      const original: PlaintextData = {
        r: 'b',
        t: EPOCH_2025_MINUTES + 1000,
        v: '5',
      }

      const encoded = encodePlaintext(original)
      const decoded = decodePlaintext(encoded)

      expect(decoded.r).toBe(original.r)
      expect(decoded.t).toBe(original.t)
      expect(decoded.v).toBe(original.v)
    })

    test('medium value (2-byte varint)', () => {
      const original: PlaintextData = {
        r: 's',
        t: EPOCH_2025_MINUTES + 2000,
        v: '1000', // This was the bug case - should decode correctly
      }

      const encoded = encodePlaintext(original)
      const decoded = decodePlaintext(encoded)

      expect(decoded.r).toBe(original.r)
      expect(decoded.t).toBe(original.t)
      expect(decoded.v).toBe(original.v)
    })

    test('edge case values', () => {
      const testCases = [
        { description: 'zero', value: '0' },
        { description: 'max 1-byte varint', value: '127' },
        { description: 'min 2-byte varint', value: '128' },
        { description: 'max 2-byte varint', value: '16383' },
        { description: 'min 3-byte varint', value: '16384' },
        { description: 'max 3-byte varint', value: '2097151' },
        { description: 'min 4-byte varint', value: '2097152' },
        { description: 'large value', value: '1000000' },
      ]

      for (const testCase of testCases) {
        const original: PlaintextData = {
          r: 'b',
          t: EPOCH_2025_MINUTES + 1000,
          v: testCase.value,
        }

        const encoded = encodePlaintext(original)
        const decoded = decodePlaintext(encoded)

        expect(decoded.v).toBe(testCase.value)
      }
    })

    test('handle buyer & seller roles', () => {
      const buyer: PlaintextData = {
        r: 'b',
        t: EPOCH_2025_MINUTES + 1000,
        v: '1000',
      }

      const seller: PlaintextData = {
        r: 's',
        t: EPOCH_2025_MINUTES + 1000,
        v: '5',
      }

      const buyerEncoded = encodePlaintext(buyer)
      const sellerEncoded = encodePlaintext(seller)

      const buyerDecoded = decodePlaintext(buyerEncoded)
      const sellerDecoded = decodePlaintext(sellerEncoded)

      expect(buyerDecoded.r).toBe('b')
      expect(sellerDecoded.r).toBe('s')
    })
  })

  describe('throw when:', () => {
    test('buffer too short', () => {
      const shortBuffer = Buffer.from([0, 0, 0, 0]) // Only 4 bytes, need at least 5

      expect(() => decodePlaintext(shortBuffer)).toThrow('Buffer too short')
    })

    test('negative value', () => {
      const data: PlaintextData = {
        r: 'b',
        t: EPOCH_2025_MINUTES + 1000,
        v: '-1',
      }

      expect(() => encodePlaintext(data)).toThrow(
        'Value must be a non-negative number'
      )
    })

    test('NaN value', () => {
      const data: PlaintextData = {
        r: 'b',
        t: EPOCH_2025_MINUTES + 1000,
        v: 'not-a-number',
      }

      expect(() => encodePlaintext(data)).toThrow(
        'Value must be a non-negative number'
      )
    })

    test('timestamp out of range', () => {
      const data: PlaintextData = {
        r: 'b',
        t: EPOCH_2025_MINUTES - 1, // Before epoch
        v: '1000',
      }

      expect(() => encodePlaintext(data)).toThrow('Timestamp out of range')
    })
  })
})
