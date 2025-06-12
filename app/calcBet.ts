export type Label = 'NO' | 'YES'

type Discount = { absolute: number; relative: number }

type MidpointShape = {
  _midpoint: number
  discounts: {
    left: Discount
    right: Discount
  }
}

type NewShape = {
  linear: MidpointShape
  relative: MidpointShape
}

export function calcBet(
  odds1: number,
  odds2: number
): null | {
  leftAmount: number
  leftEv: number
  leftLabel: Label
  newShape: NewShape
  normalized: number
  opposite: number
  rightAmount: number
  rightEv: number
  rightLabel: Label
} {
  if (!odds1 || !odds2) return null
  if (odds1 === 0 || odds2 === 0) return null
  if (Number.isNaN(odds1) || Number.isNaN(odds2)) return null

  // Determine sides
  const leftLabel: Label = odds1 > odds2 ? 'YES' : 'NO'
  const rightLabel: Label = leftLabel === 'NO' ? 'YES' : 'NO'

  // Probabilities
  const leftP = odds1 / 100
  const rightP = odds2 / 100

  // Use arithmetic midpoint to determine amounts
  const arithmeticMidpoint = (leftP + rightP) / 2
  const opposite = 1 - arithmeticMidpoint
  const normalized =
    arithmeticMidpoint < 0.5
      ? opposite / arithmeticMidpoint
      : arithmeticMidpoint / opposite
  const leftAmount =
    arithmeticMidpoint < 0.5 && leftLabel === 'NO' ? normalized : 1
  const rightAmount = leftAmount === 1 ? normalized : 1

  // Calculate Expected Value for each side
  // EV = (Probability of winning * Amount won) - (Probability of losing * Amount lost)
  const leftEv = Math.abs(leftP * normalized - (1 - leftP))
  const rightEv = Math.abs(rightP * normalized - (1 - rightP))

  // Use relative midpoint to determine amounts
  const relativeMidpoint = getRelativeMidpoint(leftP, rightP)

  // //  Discounts
  // Arithmetic
  const leftArithmeticCost = calcCost(leftLabel, arithmeticMidpoint)
  const rightArithmeticCost = calcCost(rightLabel, arithmeticMidpoint)
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
    leftAmount,
    leftEv,
    leftLabel,
    newShape: {
      linear: {
        _midpoint: arithmeticMidpoint,
        discounts: {
          left: leftDiscountFromArithmeticMid,
          right: rightDiscountFromArithmeticMid,
        },
      },
      relative: {
        _midpoint: relativeMidpoint,
        discounts: {
          left: leftDiscountFromRelativeMid,
          right: rightDiscountFromRelativeMid,
        },
      },
    },
    normalized,
    opposite,
    rightAmount,
    rightEv,
    rightLabel,
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

/** Given two probabilities between (0,1), find the midpoint that equalizes their relative EVs */
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
