export type Label = 'NO' | 'YES'

type Discount = { absolute: number; relative: number }

export function calcBet(
  odds1: number,
  odds2: number
): null | {
  arithmeticMidpoint: number
  leftAmount: number
  leftArithmeticCost: number
  leftDiscountFromArithmeticMid: Discount
  leftDiscountFromRelativeMid: Discount
  leftEv: number
  leftLabel: Label
  leftRelativeCost: number
  normalized: number
  opposite: number
  relativeMidpoint: number
  rightAmount: number
  rightArithmeticCost: number
  rightDiscountFromArithmeticMid: Discount
  rightDiscountFromRelativeMid: Discount
  rightEv: number
  rightLabel: Label
  rightRelativeCost: number
} {
  if (!odds1 || !odds2) return null
  if (odds1 === 0 || odds2 === 0) return null
  if (Number.isNaN(odds1) || Number.isNaN(odds2)) return null

  const arithmeticMidpoint = (odds1 + odds2) / 2
  const opposite = 100 - arithmeticMidpoint
  const normalized =
    arithmeticMidpoint < 50
      ? opposite / arithmeticMidpoint
      : arithmeticMidpoint / opposite

  // Determine sides
  const leftLabel: Label = odds1 > odds2 ? 'YES' : 'NO'
  const rightLabel: Label = leftLabel === 'NO' ? 'YES' : 'NO'

  // Determine sides (same as your app)
  const leftAmount =
    arithmeticMidpoint < 50 && leftLabel === 'NO' ? normalized : 1
  const rightAmount = leftAmount === 1 ? normalized : 1

  // Probabilities
  const leftP = odds1 / 100
  const rightP = odds2 / 100
  const midP = arithmeticMidpoint / 100

  // Calculate Expected Value for each side
  // EV = (Probability of winning * Amount won) - (Probability of losing * Amount lost)
  const leftEv = Math.abs(leftP * normalized - (1 - leftP))
  const rightEv = Math.abs(rightP * normalized - (1 - rightP))

  // Relative midpoint
  const relativeMidpoint = getRelativeMidpoint(leftP, rightP)

  // //  Discounts
  // Arithmetic
  const leftArithmeticCost = calcCost(leftLabel, midP)
  const rightArithmeticCost = calcCost(rightLabel, midP)
  const leftDiscountFromArithmeticMid = calcDiscount(leftP, leftArithmeticCost)
  const rightDiscountFromArithmeticMid = calcDiscount(
    rightP,
    rightArithmeticCost
  )

  // Relative
  const leftRelativeCost = calcCost(leftLabel, relativeMidpoint)
  const rightRelativeCost = calcCost(rightLabel, relativeMidpoint)
  const leftDiscountFromRelativeMid = calcDiscount(leftP, leftRelativeCost)
  const rightDiscountFromRelativeMid = calcDiscount(rightP, rightRelativeCost)

  return {
    arithmeticMidpoint,
    leftAmount,
    leftArithmeticCost,
    leftDiscountFromArithmeticMid,
    leftDiscountFromRelativeMid,
    leftEv,
    leftLabel,
    leftRelativeCost,
    normalized,
    opposite,
    relativeMidpoint,
    rightAmount,
    rightArithmeticCost,
    rightDiscountFromArithmeticMid,
    rightDiscountFromRelativeMid,
    rightEv,
    rightLabel,
    rightRelativeCost,
  }
}

function calcCost(label: Label, midpoint: number) {
  return label === 'YES' ? midpoint : 1 - midpoint
}

function calcDiscount(value: number, cost: number) {
  // console.log({ cost, value })
  const absolute = value - cost
  const relative = absolute / value
  return { absolute, relative }
}

/** Given two probabilities (between 0 and 1), returns their "relative" midpoint, that would equalize their EV */
export const getRelativeMidpoint = (p1: number, p2: number) => p1 / (p1 + p2)

/** Round a number to a given number of decimal places.  
round(Math.PI, 2)  → 3.14  
round(Math.PI, 4)  → 3.1416 */
export function round(value: number, digits: number): number {
  const factor = Math.pow(10, digits)
  return Math.round(value * factor) / factor
}
