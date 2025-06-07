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

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-4 text-gray-500">Calculation</h2>

      <p>
        <b>Midpoint:</b> {midpoint}%
      </p>
      <p className="text-xs flex justify-between text-gray-500">
        <b>Opposite:</b> {opposite}%
      </p>

      <p className="mt-6 text-xs flex justify-between text-gray-500">
        <span>Split:</span> {midpoint} : {opposite}
      </p>
      <p className="">
        <b>Reduced:</b> {midpoint / gcf} : {opposite / gcf}
      </p>
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
