export type Label = 'NO' | 'YES'

type Discount = { absolute: number; relative: number }

export function calcBet(
  odds1: number,
  odds2: number
): null | {
  arithmeticMidpoint: number
  kellyMidpoint: number
  leftAmount: number
  leftDiscountFromArithmeticMid: Discount
  leftDiscountFromRelativeMid: Discount
  leftEv: number
  leftKellyAmount: number
  leftLabel: Label
  normalized: number
  opposite: number
  relativeMidpoint: number
  rightAmount: number
  rightDiscountFromArithmeticMid: Discount
  rightDiscountFromRelativeMid: Discount
  rightEv: number
  rightKellyAmount: number
  rightLabel: Label
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
  // const leftEv = Math.abs(leftP * normalized - (1 - leftP))
  // const rightEv = Math.abs(rightP * normalized - (1 - rightP))

  // Kelly midpoint
  const kellyMidpoint = getKellyMidpoint(leftP, rightP)

  // Relative midpoint
  const relativeMidpoint = getRelativeMidpoint(leftP, rightP)

  // Discounts
  const leftDiscountFromArithmeticMid = calcDiscount(leftP, midP)
  const rightDiscountFromArithmeticMid = calcDiscount(rightP, midP)
  const leftDiscountFromRelativeMid = calcDiscount(leftP, relativeMidpoint)
  const rightDiscountFromRelativeMid = calcDiscount(rightP, relativeMidpoint)

  // Payout multiple (for the underdog side)
  const b = getPayoutMultiple(kellyMidpoint)

  // Determine amounts bet
  const leftKellyAmount = kellyMidpoint < 0.5 && leftLabel === 'NO' ? b : 1
  const rightKellyAmount = leftKellyAmount === 1 ? b : 1

  // Correct EV (NO ABS!)
  const leftEv = leftP * leftAmount - (1 - leftP) * 1
  const rightEv = rightP * rightAmount - (1 - rightP) * 1

  return {
    arithmeticMidpoint,
    kellyMidpoint,
    leftAmount,
    leftDiscountFromArithmeticMid,
    leftDiscountFromRelativeMid,
    leftEv,
    leftKellyAmount,
    leftLabel,
    normalized,
    opposite,
    relativeMidpoint,
    rightAmount,
    rightDiscountFromArithmeticMid,
    rightDiscountFromRelativeMid,
    rightEv,
    rightKellyAmount,
    rightLabel,
  }
}

function calcDiscount(value: number, cost: number) {
  // console.log({ cost, value })
  const absolute = value - cost
  const relative = absolute / value
  return { absolute, relative }
}

/** Given two probabilities (between 0 and 1), returns their "relative" midpoint, that would equalize their EV */
export const getRelativeMidpoint = (p1: number, p2: number) => p1 / (p1 + p2)

/** Converts log-odds back to probability */
export const invLogit = (l: number) => 1 / (1 + Math.exp(-l))

/** Computes Kelly midpoint: a fair midpoint where both sides have equal subjective EV */
export function getKellyMidpoint(p1: number, p2: number) {
  const l1 = logit(p1)
  const l2 = logit(p2)
  const midLogit = (l1 + l2) / 2
  return invLogit(midLogit)
}

/** Converts probability to log-odds (logit space) */
export const logit = (p: number) => Math.log(p / (1 - p))

export function getPayoutMultiple(midpointP: number) {
  return (1 - midpointP) / midpointP
}

/** Round a number to a given number of decimal places.  
round(Math.PI, 2)  → 3.14  
round(Math.PI, 4)  → 3.1416 */
export function round(value: number, digits: number): number {
  const factor = Math.pow(10, digits)
  return Math.round(value * factor) / factor
}
