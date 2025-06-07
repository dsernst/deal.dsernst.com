import { expect, test, describe } from 'bun:test'
import { calcBet, round } from './calcBet'

describe('round()', () => {
  test('rounds to specified decimal places', () => {
    expect(round(3.14159265, 2)).toBe(3.14)
    expect(round(3.14159265, 4)).toBe(3.1416)
    expect(round(3.14159265, 0)).toBe(3)
  })

  test('handles negative numbers', () => {
    expect(round(-3.14159265, 2)).toBe(-3.14)
  })

  test('handles zero', () => {
    expect(round(0, 2)).toBe(0)
  })
})

describe('calcBet()', () => {
  test('returns null for invalid inputs', () => {
    expect(calcBet(0, 50)).toBeNull()
    expect(calcBet(50, 0)).toBeNull()
    expect(calcBet(NaN, 50)).toBeNull()
    expect(calcBet(50, NaN)).toBeNull()
    expect(calcBet(0, 0)).toBeNull()
  })

  test('calculates correct labels when odds1 > odds2', () => {
    const result = calcBet(60, 40)
    expect(result).not.toBeNull()
    expect(result?.leftLabel).toBe('YES')
    expect(result?.rightLabel).toBe('NO')
  })

  test('calculates correct labels when odds1 < odds2', () => {
    const result = calcBet(40, 60)
    expect(result).not.toBeNull()
    expect(result?.leftLabel).toBe('NO')
    expect(result?.rightLabel).toBe('YES')
  })

  test('calculates correct amounts for balanced odds', () => {
    const result = calcBet(50, 50)
    expect(result).not.toBeNull()
    expect(result?.leftAmount).toBe(1)
    expect(result?.rightAmount).toBe(1)
  })

  test('calculates correct amounts for unbalanced odds', () => {
    const result = calcBet(75, 25)
    expect(result).not.toBeNull()
    expect(result?.midpoint).toBe(50)
    expect(result?.opposite).toBe(50)
    expect(result?.normalized).toBe(1)
  })

  test('calculates correct normalized values', () => {
    const result = calcBet(80, 20)
    expect(result).not.toBeNull()
    expect(result?.midpoint).toBe(50)
    expect(result?.opposite).toBe(50)
    expect(result?.normalized).toBe(1)
  })

  test('handles edge cases', () => {
    const result = calcBet(99, 1)
    expect(result).not.toBeNull()
    expect(result?.midpoint).toBe(50)
    expect(result?.opposite).toBe(50)
  })
})
