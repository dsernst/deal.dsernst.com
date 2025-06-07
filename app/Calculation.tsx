export const Calculation = ({
  odds1,
  odds2,
}: {
  odds1: string
  odds2: string
}) => {
  if (!odds1 || !odds2) return null

  const midpoint = (Number(odds1) + Number(odds2)) / 2
  const opposite = 100 - midpoint
  const gcf = gcd(midpoint, opposite)
  const reducedIsntNormalized = midpoint / gcf !== 1

  return (
    <div className="mt-8 *:flex *:justify-between *:gap-4">
      <h2 className="text-lg font-bold mb-4 text-gray-500">Calculation</h2>

      <p>
        <b>Midpoint:</b> {midpoint}%
      </p>
      <p className="text-xs text-gray-500">
        <b>Opposite:</b> {opposite}%
      </p>

      <p className="mt-6 text-xs text-gray-500">
        <b>Split:</b> {midpoint} : {opposite}
      </p>
      <p className={reducedIsntNormalized ? 'text-xs text-gray-500' : ''}>
        <b>Reduced:</b> {midpoint / gcf} : {opposite / gcf}
      </p>

      {reducedIsntNormalized && (
        <p>
          <b>Normalized:</b> {1} : {round(opposite / midpoint, 2)}
        </p>
      )}
    </div>
  )
}

/** Here’s a clean, simple TypeScript function to compute Greatest Common Factor (GCF), also called Greatest Common Divisor (GCD), using the Euclidean algorithm. 

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
