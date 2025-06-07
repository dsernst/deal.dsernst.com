export type Label = 'YES' | 'NO'

export function calcBet(
  odds1: number,
  odds2: number
): {
  leftLabel: Label
  rightLabel: Label
  leftAmount: number
  rightAmount: number
  midpoint: number
  opposite: number
  gcf: number
  normalized: number
  reducedIsntNormalized: boolean
} | null {
  if (!odds1 || !odds2) return null
  if (odds1 === 0 || odds2 === 0) return null
  if (Number.isNaN(odds1) || Number.isNaN(odds2)) return null

  const midpoint = (odds1 + odds2) / 2
  const opposite = 100 - midpoint
  const gcf = gcd(midpoint, opposite)
  const reducedIsntNormalized = midpoint / gcf !== 1
  const normalized = midpoint < 50 ? opposite / midpoint : midpoint / opposite

  const leftLabel: Label = odds1 > odds2 ? 'YES' : 'NO'
  const rightLabel: Label = leftLabel === 'NO' ? 'YES' : 'NO'
  const leftAmount = midpoint < 50 && leftLabel === 'NO' ? normalized : 1
  const rightAmount = leftAmount === 1 ? normalized : 1

  return {
    leftLabel,
    rightLabel,
    leftAmount,
    rightAmount,
    midpoint,
    opposite,
    gcf,
    normalized,
    reducedIsntNormalized,
  }
}

/** Compute Greatest Common Factor (GCF), also called Greatest Common Divisor (GCD), using the Euclidean algorithm.

gcd(48, 18) → 6 */
function gcd(a: number, b: number): number {
  while (b !== 0) {
    const temp = b
    b = a % b
    a = temp
  }
  return Math.abs(a)
}

/** Round a number to a given number of decimal places.

round(3.14159265, 2)  → 3.14  
round(3.14159265, 4)  → 3.1416 */
export function round(value: number, digits: number): number {
  const factor = Math.pow(10, digits)
  return Math.round(value * factor) / factor
}
