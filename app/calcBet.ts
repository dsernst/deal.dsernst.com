export type Label = 'NO' | 'YES'

export type MidpointCalculations = {
  _midpoint: number
  amounts: readonly [number, number]
  discounts: {
    left: Discount
    right: Discount
  }
  normalized: number
  opposite: number
}

type BetCalculations = {
  labels: [Label, Label]
  linear: MidpointCalculations
  relative: MidpointCalculations
}

type Discount = { absolute: number; relative: number }

export function calcBet(odds1: number, odds2: number): BetCalculations | null {
  if (!odds1 || !odds2) return null
  if (odds1 === 0 || odds2 === 0) return null
  if (Number.isNaN(odds1) || Number.isNaN(odds2)) return null

  // Determine sides
  const leftLabel: Label = odds1 > odds2 ? 'YES' : 'NO'
  const rightLabel: Label = leftLabel === 'NO' ? 'YES' : 'NO'

  // Probabilities
  const leftP = odds1 / 100
  const rightP = odds2 / 100

  // Midpoints
  const arithmeticMidpoint = (leftP + rightP) / 2
  const relativeMidpoint = getRelativeMidpoint(leftP, rightP)

  // Amounts
  const calcAmounts = (midpoint: number) => {
    const opposite = 1 - midpoint
    const normalized =
      midpoint < 0.5 ? opposite / midpoint : midpoint / opposite
    const leftAmount = midpoint < 0.5 && leftLabel === 'NO' ? normalized : 1
    const rightAmount = leftAmount === 1 ? normalized : 1
    const amounts = [leftAmount, rightAmount] as const
    return { amounts, normalized, opposite }
  }

  // Discounts
  const calcDiscounts = (midpoint: number) => ({
    left: calcDiscount(leftP, midpoint, leftLabel),
    right: calcDiscount(rightP, midpoint, rightLabel),
  })

  // Build Midpoint Calculations
  const midpointCalculations = (midpoint: number): MidpointCalculations => ({
    _midpoint: midpoint,
    ...calcAmounts(midpoint),
    discounts: calcDiscounts(midpoint),
  })

  return {
    labels: [leftLabel, rightLabel],
    linear: midpointCalculations(arithmeticMidpoint),
    relative: midpointCalculations(relativeMidpoint),
  }
}

function calcDiscount(value: number, cost: number, label: Label) {
  if (label === 'NO') {
    value = 1 - value
    cost = 1 - cost
  }

  const absolute = value - cost
  const relative = absolute / value
  return { absolute, relative }
}

/** Given two probabilities between (0,1), find the midpoint that equalizes their relative Surplus Values */
export const getRelativeMidpoint = (p1: number, p2: number): number => {
  const yes = Math.max(p1, p2)
  const no = Math.min(p1, p2)
  return yes / (yes + 1 - no)
}

/** Round a number to a given number of decimal places.  
round(Math.PI, 2)  → 3.14  
round(Math.PI, 4)  → 3.1416 */
export function round(value: number, digits: number): number {
  const factor = Math.pow(10, digits)
  return Math.round(value * factor) / factor
}
