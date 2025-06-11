import { describe, expect, it } from 'bun:test'

import {
  calcBet,
  getKellyMidpoint,
  invLogit,
  type Label,
  logit,
  round,
} from './calcBet'

describe('round()', () => {
  it('rounds to specified decimal places', () => {
    expect(round(3.14159265, 2)).toBe(3.14)
    expect(round(3.14159265, 4)).toBe(3.1416)
    expect(round(3.14159265, 0)).toBe(3)
  })

  it('handles negative numbers', () => {
    expect(round(-3.14159265, 2)).toBe(-3.14)
  })

  it('handles zero', () => {
    expect(round(0, 2)).toBe(0)
  })
})

describe('calcBet()', () => {
  it('null for invalid inputs', () => {
    expect(calcBet(0, 50)).toBeNull()
    expect(calcBet(50, 0)).toBeNull()
    expect(calcBet(NaN, 50)).toBeNull()
    expect(calcBet(50, NaN)).toBeNull()
    expect(calcBet(0, 0)).toBeNull()
  })

  type Odds = [number, number]
  type EV = number
  type Expected = {
    left: [Label, number, EV?]
    midpoint?: number
    normalized?: number
    opposite?: number
    right: [Label, number, EV?]
  }
  const validInputTestCases: [Odds, Expected][] = [
    [
      [60, 40], // odds1 > odds2
      {
        left: ['YES', 1, 0.2],
        midpoint: 50,
        normalized: 1,
        opposite: 50,
        right: ['NO', 1, 0.2],
      },
    ],
    [[40, 60], { left: ['NO', 1], midpoint: 50, right: ['YES', 1] }],
    [[50, 50], { left: ['NO', 1], midpoint: 50, right: ['YES', 1] }],
    [[75, 25], { left: ['YES', 1], midpoint: 50, right: ['NO', 1] }],
    [[99, 1], { left: ['YES', 1], midpoint: 50, right: ['NO', 1] }],
    [[70, 20], { left: ['YES', 1, 0.556], midpoint: 45, right: ['NO', 1.22] }],
    [[20, 70], { left: ['NO', 1.22], right: ['YES', 1] }],
    [[48, 52], { left: ['NO', 1], right: ['YES', 1] }],
    [[2, 40], { left: ['NO', 3.76], right: ['YES', 1] }],
    [[40, 2], { left: ['YES', 1], right: ['NO', 3.76] }],
    [[1, 5], { left: ['NO', 32.33], right: ['YES', 1] }],
    [[10, 90], { left: ['NO', 1], right: ['YES', 1] }],
    [[10, 50], { left: ['NO', 2.33, 0.667], right: ['YES', 1, 0.667] }],
    [[50, 10], { left: ['YES', 1, 0.667], right: ['NO', 2.33, 0.667] }],
  ]

  validInputTestCases.forEach(([[odds1, odds2], expected]) => {
    it(`${String(odds1).padStart(2, ' ')} vs ${odds2}`, () => {
      const result = calcBet(odds1, odds2)
      expect(result).not.toBeNull()
      if (!result) throw new Error('Result should not be null')

      expect(result.leftLabel).toBe(expected.left[0])
      expect(result.rightLabel).toBe(expected.right[0])
      expect(round(result.leftAmount, 2)).toBe(expected.left[1])
      expect(round(result.rightAmount, 2)).toBe(expected.right[1])
      if (expected.midpoint)
        expect(result.arithmeticMidpoint).toBe(expected.midpoint)
      if (expected.opposite) expect(result.opposite).toBe(expected.opposite)
      if (expected.normalized)
        expect(result.normalized).toBe(expected.normalized)
      // if (expected.left[2])
      //   expect(round(result.leftEv, 3)).toBe(expected.left[2])
      // if (expected.right[2])
      //   expect(round(result.rightEv, 3)).toBe(expected.right[2])
    })
  })
})

describe('logit / invLogit', () => {
  it('should round-trip correctly', () => {
    const probs = [0.01, 0.1, 0.25, 0.5, 0.75, 0.9, 0.99]
    probs.forEach((p) => {
      const l = logit(p)
      const p2 = invLogit(l)
      expect(p2).toBeCloseTo(p, 10) // very high precision
    })
  })
})

describe('kellyMidpoint', () => {
  it('should return arithmetic midpoint when beliefs are equal', () => {
    const p = 0.6
    const kMid = getKellyMidpoint(p, p)
    expect(kMid).toBeCloseTo(p, 10)
  })

  it('should be between the two inputs', () => {
    const p1 = 0.4
    const p2 = 0.7
    const kMid = getKellyMidpoint(p1, p2)
    expect(kMid).toBeGreaterThanOrEqual(Math.min(p1, p2))
    expect(kMid).toBeLessThanOrEqual(Math.max(p1, p2))
  })

  it('should be slightly shifted compared to arithmetic midpoint', () => {
    const p1 = 0.58
    const p2 = 0.64
    const arithmeticMid = (p1 + p2) / 2
    const kMid = getKellyMidpoint(p1, p2)
    // Should not exactly equal arithmetic midpoint
    expect(kMid).not.toBeCloseTo(arithmeticMid, 10)
  })
})

describe('relativeMidpoint & calcDiscount()', () => {
  it('should match our expected calculations', () => {
    const example = {
      inputs: [99, 50],
      outputs: {
        arithmetic: {
          _midpoint: 74.5,
          discounts: {
            left: { absolute: 0.245, relative: 0.247 },
            right: { absolute: 0.245, relative: 0.49 },
          },
        },
        relative: {
          _midpoint: 0.6644,
          discounts: {
            left: { absolute: 0.326, relative: 0.329 },
            right: { absolute: 0.164, relative: 0.3288 },
          },
        },
      },
    }

    const results = calcBet(example.inputs[0], example.inputs[1])
    if (!results) throw new Error('Results should not be null')
    const r = results // alias

    const mapping = {
      arithmetic: {
        _midpoint: r.arithmeticMidpoint,
        discounts: {
          left: r.leftDiscountFromArithmeticMid,
          right: r.rightDiscountFromArithmeticMid,
        },
      },
      relative: {
        _midpoint: r.relativeMidpoint,
        discounts: {
          left: r.leftDiscountFromRelativeMid,
          right: r.rightDiscountFromRelativeMid,
        },
      },
    }

    const expecteds = traverseTree(mapping)
    for (const [key, actual] of Object.entries(expecteds)) {
      expect(getNestedValue(example.outputs, key), key).toBeCloseTo(actual, 3)
    }
  })
})

/** const data = { foo: { bar: { baz: 42 } } }
getNestedValue(data, 'foo.bar.baz') // 42
getNestedValue(data, 'foo.bar.qux') // undefined */
export function getNestedValue(obj: Record<string, unknown>, path: string) {
  // @ts-expect-error - its a deeply nested tree
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

/** Given a deeply nested object, returns a flat object with keys like "foo.bar.baz" */
function traverseTree(tree: unknown) {
  const result: Record<string, number> = {}
  // @ts-expect-error - its a deeply nested tree
  for (const [key, value] of Object.entries(tree)) {
    if (typeof value === 'object') {
      const subResult = traverseTree(value)
      for (const [subKey, subValue] of Object.entries(subResult)) {
        result[key + '.' + subKey] = subValue
      }
    } else {
      // @ts-expect-error - its a deeply nested tree
      result[key] = value
    }
  }
  return result
}
