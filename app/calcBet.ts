export type Label = 'NO' | 'YES'

export function calcBet(
  odds1: number,
  odds2: number
): null | {
  leftAmount: number
  leftEv: number
  leftLabel: Label
  midpoint: number
  normalized: number
  opposite: number
  rightAmount: number
  rightEv: number
  rightLabel: Label
} {
  if (!odds1 || !odds2) return null
  if (odds1 === 0 || odds2 === 0) return null
  if (Number.isNaN(odds1) || Number.isNaN(odds2)) return null

  const midpoint = (odds1 + odds2) / 2
  const opposite = 100 - midpoint
  const normalized = midpoint < 50 ? opposite / midpoint : midpoint / opposite

  const leftLabel: Label = odds1 > odds2 ? 'YES' : 'NO'
  const rightLabel: Label = leftLabel === 'NO' ? 'YES' : 'NO'
  const leftAmount = midpoint < 50 && leftLabel === 'NO' ? normalized : 1
  const rightAmount = leftAmount === 1 ? normalized : 1

  // Calculate Expected Value for each side
  // EV = (Probability of winning * Amount won) - (Probability of losing * Amount lost)
  const leftP = odds1 / 100
  const leftEv = Math.abs(leftP * normalized - (1 - leftP))
  const rightP = odds2 / 100
  const rightEv = Math.abs(rightP * normalized - (1 - rightP))

  return {
    leftAmount,
    leftEv,
    leftLabel,
    midpoint,
    normalized,
    opposite,
    rightAmount,
    rightEv,
    rightLabel,
  }
}

/** Round a number to a given number of decimal places.

round(3.14159265, 2)  → 3.14  
round(3.14159265, 4)  → 3.1416 */
export function round(value: number, digits: number): number {
  const factor = Math.pow(10, digits)
  return Math.round(value * factor) / factor
}
