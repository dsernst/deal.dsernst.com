import { describe, expect, it } from 'bun:test'

import { calcBet, getRelativeMidpoint, type Label, round } from './calcBet'

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

describe('getRelativeMidpoint()', () => {
  it('should be symmetric', () => {
    expect(getRelativeMidpoint(0.99, 0.5)).toEqual(
      getRelativeMidpoint(0.5, 0.99)
    )
  })
  it('should allow values < 0.5', () => {
    const expecteds = [
      [0.1, 0.3, 0.25],
      [0.3, 0.1, 0.25],
      [0.05, 0.4, 0.2962],
      [0.4, 0.05, 0.2962],
    ]

    for (const [p1, p2, expected] of expecteds) {
      expect(getRelativeMidpoint(p1, p2)).toBeCloseTo(expected)
    }
  })
})

describe('relativeMidpoints', () => {
  const examples = [
    {
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
    },
    {
      inputs: [50, 99],
      outputs: {
        arithmetic: {
          _midpoint: 74.5,
          discounts: {
            left: { absolute: 0.245, relative: 0.49 },
            right: { absolute: 0.245, relative: 0.247 },
          },
        },
        relative: {
          _midpoint: 0.6644,
          discounts: {
            left: { absolute: 0.164, relative: 0.3288 },
            right: { absolute: 0.326, relative: 0.329 },
          },
        },
      },
    },
    {
      inputs: [50, 50],
      outputs: {
        arithmetic: {
          _midpoint: 50,
          discounts: {
            left: { absolute: 0, relative: 0 },
            right: { absolute: 0, relative: 0 },
          },
        },
        relative: {
          _midpoint: 0.5,
          discounts: {
            left: { absolute: 0, relative: 0 },
            right: { absolute: 0, relative: 0 },
          },
        },
      },
    },
    {
      inputs: [50, 70],
      outputs: {
        arithmetic: {
          _midpoint: 60,
          discounts: {
            left: { absolute: 0.1, relative: 0.1999 },
            right: { absolute: 0.1, relative: 0.1428 },
          },
        },
        relative: {
          _midpoint: 0.583,
          discounts: {
            left: { absolute: 0.0833, relative: 0.1666 },
            right: { absolute: 0.1166, relative: 0.1666 },
          },
        },
      },
    },
  ]

  for (const { inputs, outputs } of examples) {
    it(`${inputs[0]} vs ${inputs[1]}`, () => {
      const results = calcBet(inputs[0], inputs[1])
      if (!results) throw new Error('Results should not be null')

      const r = results
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

      const actuals = traverseTree(mapping)
      for (const [key, actual] of Object.entries(actuals)) {
        expect(actual, key).toBeCloseTo(getNestedValue(outputs, key), 3)
      }

      // Arithmetic midpoint's absolute discounts should be equal
      expect(mapping.arithmetic.discounts.left.absolute).toBeCloseTo(
        mapping.arithmetic.discounts.right.absolute,
        10
      )
      // Relative midpoint's relative discounts should be equal
      expect(mapping.relative.discounts.left.relative).toBeCloseTo(
        mapping.relative.discounts.right.relative,
        10
      )

      // Relative midpoint should be not depend on the order of the inputs
      const reversedResults = calcBet(inputs[1], inputs[0])
      if (!reversedResults)
        throw new Error('Reversed results should not be null')
      expect(mapping.relative._midpoint).toBeCloseTo(
        reversedResults.relativeMidpoint,
        10
      )
    })
  }
})

/** const data = { foo: { bar: { baz: 42 } } }
getNestedValue(data, 'foo.bar.baz') // 42
getNestedValue(data, 'foo.bar.qux') // undefined */
export function getNestedValue(
  obj: Record<string, unknown>,
  path: string
): number {
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
